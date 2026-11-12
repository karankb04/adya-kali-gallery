"use client";
import { KaliImage } from "@/types/image";
import { r2url } from "@/lib/r2";
import DomeGallery from "@/components/reactbits/DomeGallery";

/** React Bits' dome gallery, filled with her darshans (whole, in colour). */
export default function DomeDarshan({ images }: { images: KaliImage[] }) {
  return (
    <div className="s3-dome">
      <DomeGallery
        images={images.map((img) => ({ src: r2url(img.r2Key), alt: img.altText ?? img.transliteration }))}
        overlayBlurColor="#170907"
        grayscale={false}
        imageBorderRadius="6px"
        openedImageBorderRadius="10px"
      />
    </div>
  );
}
