// The site's only server code. Pages and photo sizes are static files served
// by Cloudflare straight from out/ (free, unlimited); this script only runs for
// requests that match no file, plus the nightly rebuild.

function sanitizeName(name) {
  // strip anything that could break the header / path
  return (name || "adya-kali.jpg").replace(/[\r\n"\\/]+/g, "").slice(0, 120);
}

/**
 * Same-origin download proxy (moved from app/api/download/route.ts). The R2
 * public bucket sends no CORS headers, so the browser ignores `download` on a
 * cross-origin link. Streaming it back from our own origin with
 * `Content-Disposition: attachment` always downloads.
 *
 *   /api/download?key=<r2Key>&name=<filename>
 */
async function download(url, env) {
  const key = url.searchParams.get("key");
  const name = sanitizeName(url.searchParams.get("name") || "");
  if (!key) return new Response("Missing image key.", { status: 400 });

  const upstream = await fetch(`${env.R2_BASE_URL}/${key.split("/").map(encodeURIComponent).join("/")}`);
  if (!upstream.ok || !upstream.body) return new Response("Image not found.", { status: 404 });

  // Only ever hand back gallery media, whatever else might land in the bucket.
  const contentType = upstream.headers.get("content-type") || "";
  if (!/^(image|video)\//.test(contentType)) return new Response("Not a gallery file.", { status: 415 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/download") return download(url, env);
    // Anything else: the static files (unknown paths get the 404 page).
    return env.ASSETS.fetch(request);
  },

  // Nightly: rebuild the site so new Sheet photos and Today's Darshan appear.
  // DEPLOY_HOOK_URL is a secret (the Workers Builds deploy hook).
  async scheduled(_event, env, ctx) {
    if (!env.DEPLOY_HOOK_URL) return;
    ctx.waitUntil(fetch(env.DEPLOY_HOOK_URL, { method: "POST" }));
  },
};
