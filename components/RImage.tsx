"use client";
import Image from "next/image";
import { r2url } from "@/lib/r2";

interface RImageProps {
  r2Key: string;
  alt: string;
  width?: number;
  height?: number;
  sizes: string;
  className?: string;
  dominantColor?: string;
  priority?: boolean;
  quality?: number;
  style?: React.CSSProperties;
}

/** Tiny solid-colour SVG used as a native blur placeholder (smooth fade-in). */
function blurData(hex: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10">` +
    `<rect width="8" height="10" fill="${hex}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * next/image wrapper for Cloudflare R2 sources.
 * Vercel optimizes (resize + WebP/AVIF + lazy-load); a dominant-colour blur
 * placeholder fades smoothly into the image so there is no hard pop-in.
 */
export default function RImage({
  r2Key,
  alt,
  width,
  height,
  sizes,
  className,
  dominantColor,
  priority,
  quality,
  style,
}: RImageProps) {
  const w = width ?? 1024;
  const h = height ?? Math.round(w * 1.3);
  const placeholder = dominantColor ? "blur" : "empty";
  return (
    <Image
      src={r2url(r2Key)}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      className={className}
      priority={priority}
      quality={quality}
      loading={priority ? undefined : "lazy"}
      placeholder={placeholder}
      blurDataURL={dominantColor ? blurData(dominantColor) : undefined}
      style={style}
    />
  );
}
