import { imagePath } from "./imageSizes.mjs";

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

/**
 * The site is a static export, so there is no image server. Every size is made
 * ahead of time by scripts/generate-images.mjs; this only points at the file.
 * In `next dev` the original is shown (the sizes don't exist yet).
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (process.env.NODE_ENV === "development") return src;
  if (R2_BASE && src.startsWith(R2_BASE + "/")) {
    const key = src
      .slice(R2_BASE.length + 1)
      .split("/")
      .map(decodeURIComponent)
      .join("/");
    return imagePath(key, width);
  }
  if (src.startsWith("/") && !src.endsWith(".svg")) return imagePath(`local:${src}`, width);
  return src;
}
