// Makes every photo size the pages ask for (runs after `next build`).
//
// The site is a static export with no image server, so lib/imageLoader.ts
// points each <Image> at /_img/<name>-<width>.webp. This script finds every
// photo the built pages use, and for each one puts all widths in out/_img/:
//   1. from .img-cache/ (local builds), else
//   2. from the live site, if it already has them (so the nightly rebuild only
//      resizes NEW photos), else
//   3. by downloading the original from R2 and resizing it with sharp.
// Any photo that can't be made fails the build, so a bad rebuild never
// replaces the working site.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, copyFileSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";
import { ALL_WIDTHS, OUT_DIR, imageBaseName } from "../lib/imageSizes.mjs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const OUT = "out";
const CACHE = ".img-cache";
const R2_BASE = (process.env.NEXT_PUBLIC_R2_BASE_URL || "").replace(/\/$/, "");
const LIVE = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const QUALITY = 78;

function walk(dir, exts) {
  const list = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== "_next" && name !== OUT_DIR) list.push(...walk(p, exts));
    } else if (exts.includes(extname(name))) list.push(p);
  }
  return list;
}

// 1. Which photos do the pages use? Their R2 keys are in the page data
//    ("r2Key", "thumbnailR2Key", ...), escaped inside HTML, plain in .txt.
const ids = new Set();
const KEY_RE = /[rR]2Key\\?"\s*:\s*\\?"((?:[^"\\]|\\u[0-9a-fA-F]{4})+)\\?"/g;
for (const file of walk(OUT, [".html", ".txt"])) {
  for (const m of readFileSync(file, "utf8").matchAll(KEY_RE)) {
    ids.add(JSON.parse(`"${m[1]}"`));
  }
}
// Plus images sitting at the top of public/ (e.g. the hero title).
for (const name of readdirSync("public")) {
  if (/\.(png|jpe?g|webp)$/i.test(name)) ids.add(`local:/${name}`);
}

mkdirSync(join(OUT, OUT_DIR), { recursive: true });
mkdirSync(CACHE, { recursive: true });

const fileName = (id, w) => `${imageBaseName(id)}-${w}.webp`;
const stats = { cache: 0, live: 0, made: 0 };
const failed = [];

async function fromLive(id) {
  if (!LIVE) return null;
  const bufs = [];
  for (const w of ALL_WIDTHS) {
    try {
      const res = await fetch(`${LIVE}/${OUT_DIR}/${fileName(id, w)}`);
      if (!res.ok || res.headers.get("content-type") !== "image/webp") return null;
      bufs.push(Buffer.from(await res.arrayBuffer()));
    } catch {
      return null;
    }
  }
  return bufs;
}

async function original(id) {
  if (id.startsWith("local:")) return readFileSync(join("public", id.slice("local:/".length)));
  if (!R2_BASE) throw new Error("NEXT_PUBLIC_R2_BASE_URL is not set");
  const url = `${R2_BASE}/${id.split("/").map(encodeURIComponent).join("/")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`R2 ${res.status} for ${id}`);
  return Buffer.from(await res.arrayBuffer());
}

async function makeOne(id) {
  const cached = ALL_WIDTHS.every((w) => existsSync(join(CACHE, fileName(id, w))));
  if (cached) {
    stats.cache++;
  } else {
    let bufs = await fromLive(id);
    if (bufs) stats.live++;
    else {
      const src = await original(id);
      bufs = [];
      for (const w of ALL_WIDTHS) {
        bufs.push(
          await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer()
        );
      }
      stats.made++;
    }
    ALL_WIDTHS.forEach((w, i) => writeFileSync(join(CACHE, fileName(id, w)), bufs[i]));
  }
  for (const w of ALL_WIDTHS) copyFileSync(join(CACHE, fileName(id, w)), join(OUT, OUT_DIR, fileName(id, w)));
}

// A few at a time: fast, without flooding R2 or memory.
const queue = [...ids];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const id = queue.shift();
      try {
        await makeOne(id);
      } catch (err) {
        failed.push(`${id}: ${err.message}`);
      }
    }
  })
);

// 2. Safety net: every /_img/ file a built page links to must exist.
const missing = new Set();
for (const file of walk(OUT, [".html"])) {
  for (const m of readFileSync(file, "utf8").matchAll(/\/_img\/([a-z0-9-]+\.webp)/g)) {
    if (!existsSync(join(OUT, OUT_DIR, m[1]))) missing.add(m[1]);
  }
}

console.log(
  `[generate-images] ${ids.size} photos × ${ALL_WIDTHS.length} sizes — ` +
    `${stats.cache} from cache, ${stats.live} from live site, ${stats.made} newly made`
);
if (failed.length || missing.size) {
  failed.forEach((f) => console.error(`[generate-images] FAILED ${f}`));
  missing.forEach((f) => console.error(`[generate-images] MISSING ${f}`));
  process.exit(1);
}
