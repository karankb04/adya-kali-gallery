import { r2url } from "@/lib/r2";

/**
 * Same-origin download proxy. The R2 public bucket sends no CORS headers, so a
 * client-side fetch+blob download fails and the browser ignores the `download`
 * attribute on a cross-origin link. This route streams the image back from our
 * own origin with `Content-Disposition: attachment`, which always downloads.
 *
 *   /api/download?key=<r2Key>&name=<filename>
 */
export const runtime = "edge";

function sanitizeName(name: string): string {
  // strip anything that could break the header / path
  return (name || "adya-kali.jpg").replace(/[\r\n"\\/]+/g, "").slice(0, 120);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const name = sanitizeName(searchParams.get("name") || "");

  if (!key) {
    return new Response("Missing image key.", { status: 400 });
  }

  const upstream = await fetch(r2url(key), { cache: "force-cache" });
  if (!upstream.ok || !upstream.body) {
    return new Response("Image not found.", { status: 404 });
  }

  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
