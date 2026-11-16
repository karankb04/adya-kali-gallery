// Next 16 static-export bug workaround (runs after `next build`).
// The export writes link-prefetch data nested, e.g.
//   out/about/__next.about/__PAGE__.txt
// but the browser asks for the dotted form
//   /about/__next.about.__PAGE__.txt
// On a static host every prefetch 404s, so each link click becomes a full page
// reload. This copies every nested file to its dotted path.
import { readdirSync, statSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
let copied = 0;

function filesUnder(dir, prefix = []) {
  const list = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) list.push(...filesUnder(p, [...prefix, name]));
    else list.push({ path: p, parts: [...prefix, name] });
  }
  return list;
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const f of filesUnder(p)) {
        copyFileSync(f.path, join(dir, [name, ...f.parts].join(".")));
        copied++;
      }
    } else if (name !== "_next" && name !== "_img") {
      walk(p);
    }
  }
}

walk(OUT);
console.log(`[flatten-rsc] copied ${copied} prefetch files to their dotted paths`);
