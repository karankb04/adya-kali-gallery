// Shared by next.config.mjs, the image loader and scripts/generate-images.mjs,
// so the widths the pages ask for are exactly the files the build makes.
export const DEVICE_SIZES = [640, 828, 1080, 1600, 2048];
export const IMAGE_SIZES = [256, 384];
export const ALL_WIDTHS = [...IMAGE_SIZES, ...DEVICE_SIZES];
export const OUT_DIR = "_img";

/** Short stable hash (FNV-1a) so odd R2 keys (spaces, brackets) become safe file names. */
function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/**
 * File name (without width/extension) for one source image.
 * `id` is the R2 key for gallery photos, or "local:/path.png" for files in public/.
 */
export function imageBaseName(id) {
  const slug = id
    .replace(/^local:\//, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${slug || "img"}-${hash(id)}`;
}

export function imagePath(id, width) {
  return `/${OUT_DIR}/${imageBaseName(id)}-${width}.webp`;
}
