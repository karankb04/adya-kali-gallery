"use client";
import { useEffect } from "react";
import { KaliImage } from "@/types/image";

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

interface DarshanModalProps {
  image: KaliImage | null;
  onClose: () => void;
}

export default function DarshanModal({ image, onClose }: DarshanModalProps) {
  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  if (!image) return null;

  const imgSrc = R2_BASE
    ? `${R2_BASE}/${image.r2Key}`
    : `https://placehold.co/600x800?text=${encodeURIComponent(image.transliteration)}`;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(60% 60% at 50% 40%, rgba(28,10,6,0.95), rgba(12,5,3,0.98))",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="max-w-[980px] w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* image */}
        <div
          className="rounded-[10px] overflow-hidden"
          style={{
            boxShadow:
              "0 30px 80px -30px #000, 0 0 0 1px rgba(255,90,77,0.25), 0 0 70px rgba(219,31,36,0.22)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={image.transliteration}
            className="w-full block max-h-[78vh] object-contain bg-[#160a05]"
          />
        </div>

        {/* meta */}
        <div>
          <p
            className="font-deva font-bold text-rose leading-tight"
            style={{ fontSize: "clamp(1.9rem,4.6vw,2.8rem)" }}
          >
            {image.nameDevanagari}
          </p>
          <p className="text-white text-[1.15rem] font-medium mt-1">
            {image.transliteration}
          </p>
          <div className="my-4 flex items-center gap-3 text-[0.66rem] font-semibold tracking-[0.2em] uppercase text-[rgba(251,242,228,0.78)]">
            <span>{image.form}</span>
            <span className="w-[5px] h-[5px] rounded-full bg-red inline-block" />
            {image.isAI && <span>AI Generated</span>}
          </div>
          <p className="text-[rgba(251,242,228,0.85)] text-[1rem] leading-relaxed">
            {image.teachingCaption}
          </p>

          <div className="mt-8 flex gap-3">
            <a
              href={imgSrc}
              download={`${image.id}.jpg`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red text-white text-sm font-semibold hover:bg-red-deep transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[rgba(251,242,228,0.2)] text-[rgba(251,242,228,0.7)] text-sm font-medium hover:border-[rgba(251,242,228,0.5)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
