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
  style?: React.CSSProperties;
}

/**
 * next/image wrapper for Cloudflare R2 sources.
 * Vercel optimizes (resize + WebP/AVIF + lazy-load); the dominant color is
 * shown as a placeholder background to avoid a blank flash while loading.
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
  style,
}: RImageProps) {
  const w = width ?? 1024;
  const h = height ?? Math.round(w * 1.3);
  return (
    <Image
      src={r2url(r2Key)}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      style={{ backgroundColor: dominantColor, ...style }}
    />
  );
}
