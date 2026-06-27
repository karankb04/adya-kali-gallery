import { getImages } from "@/lib/images";
import { SITE_URL } from "@/lib/seo";
import { r2url } from "@/lib/r2";

export const revalidate = 3600;

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const images = await getImages();

  const imageTags = images
    .map(
      (p) =>
        `    <image:image>\n` +
        `      <image:loc>${esc(r2url(p.r2Key))}</image:loc>\n` +
        `      <image:title>${esc(`${p.transliteration} — ${p.form}`)}</image:title>\n` +
        `      <image:caption>${esc(p.teachingCaption)}</image:caption>\n` +
        `    </image:image>`
    )
    .join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `  <url>\n` +
    `    <loc>${SITE_URL}/</loc>\n` +
    `${imageTags}\n` +
    `  </url>\n` +
    `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
