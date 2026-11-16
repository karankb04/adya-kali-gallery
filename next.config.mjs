import { DEVICE_SIZES, IMAGE_SIZES } from "./lib/imageSizes.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plain HTML/CSS/JS files, served by Cloudflare (wrangler.jsonc). Security
  // headers now live in public/_headers; the download route in worker/index.js.
  output: "export",
  poweredByHeader: false,
  images: {
    // No image server on a static host: every size is pre-made at build time
    // (scripts/generate-images.mjs) and lib/imageLoader.ts points at it.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    deviceSizes: DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
    // Next 16 only accepts listed qualities; 55 is the hero wall's (Hero.tsx).
    qualities: [55, 75],
  },
};

export default nextConfig;
