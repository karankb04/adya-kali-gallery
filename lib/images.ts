import { KaliImage } from "@/types/image";
import localData from "@/data/images.json";

const API_URL = process.env.IMAGES_API_URL;
const REVALIDATE_SECONDS = 60;

export function slugify(s: string): string {
  return (s || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

/** Fill in derived fields (slug, altText) so the rest of the app can rely on them. */
function normalize(list: KaliImage[]): KaliImage[] {
  const seen = new Set<string>();
  return list
    .filter((p) => p && p.r2Key && p.id)
    .map((p) => {
      let slug = p.slug && p.slug.trim() ? slugify(p.slug) : slugify(`${p.transliteration}-${p.form}`);
      if (!slug) slug = slugify(p.id);
      // de-duplicate slugs
      let unique = slug;
      let n = 2;
      while (seen.has(unique)) unique = `${slug}-${n++}`;
      seen.add(unique);

      const altText =
        p.altText && p.altText.trim()
          ? p.altText
          : `${p.transliteration} (${p.nameDevanagari}) — ${p.form}, a devotional image of Maa Adya Kali`;

      return { ...p, slug: unique, altText };
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Single source of truth for image metadata.
 * Reads the Google Apps Script Web App (the Sheet-backed JSON API) when
 * IMAGES_API_URL is set; otherwise falls back to the bundled data/images.json.
 */
export async function getImages(): Promise<KaliImage[]> {
  if (API_URL) {
    try {
      const res = await fetch(API_URL, {
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      const arr: KaliImage[] = Array.isArray(json) ? json : json.images;
      if (Array.isArray(arr) && arr.length) return normalize(arr);
      throw new Error("API returned no images");
    } catch (err) {
      console.error("[getImages] falling back to local data:", err);
    }
  }
  return normalize(localData as KaliImage[]);
}
