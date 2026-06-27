const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

export function r2url(key: string): string {
  if (!R2_BASE) return `https://placehold.co/400x500?text=${encodeURIComponent(key)}`;
  return `${R2_BASE}/${key.split("/").map(encodeURIComponent).join("/")}`;
}
