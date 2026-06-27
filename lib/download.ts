import { KaliImage } from "@/types/image";

function slugify(s: string): string {
  return (s || "adya-kali")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function extFromKey(key: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(key);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

export async function downloadImage(p: KaliImage): Promise<void> {
  let base = slugify(p.transliteration) || "adya-kali";
  if (base.indexOf("kali") < 0 && base.indexOf("bhairav") < 0) {
    base = base + "-adya-kali";
  }
  const filename = `${base}.${extFromKey(p.r2Key)}`;

  // Stream through our same-origin proxy so the browser actually downloads the
  // file (R2's public bucket has no CORS headers, so a direct cross-origin
  // link is opened in a new tab instead of downloaded).
  const href =
    `/api/download?key=${encodeURIComponent(p.r2Key)}` +
    `&name=${encodeURIComponent(filename)}`;

  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
