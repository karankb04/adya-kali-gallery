import { KaliImage } from "@/types/image";
import { r2url } from "./r2";

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
  const url = r2url(p.r2Key);

  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objUrl);
  } catch {
    // Fallback (e.g. CORS not configured): open in a new tab
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
