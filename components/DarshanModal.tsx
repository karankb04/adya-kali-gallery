"use client";
import { useEffect } from "react";
import { KaliImage } from "@/types/image";
import { downloadImage } from "@/lib/download";
import RImage from "./RImage";

interface DarshanModalProps {
  image: KaliImage | null;
  onClose: () => void;
}

export default function DarshanModal({ image, onClose }: DarshanModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = image ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  return (
    <>
      <button
        className={`mclose${image ? " show" : ""}`}
        aria-label="Close"
        onClick={onClose}
      >
        ✕
      </button>
      <div
        className={`modal${image ? " show" : ""}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="darshan">
          <div className="frame">
            {image && (
              <RImage
                r2Key={image.r2Key}
                alt={image.altText ?? `${image.transliteration} — ${image.form}`}
                width={image.width}
                height={image.height}
                dominantColor={image.dominantColor}
                sizes="(max-width:760px) 92vw, 480px"
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "78vh",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
          <div className="meta">
            <div className="d-deva">{image?.nameDevanagari}</div>
            <div className="d-tr">{image?.transliteration}</div>
            <div className="d-fm">
              <span>{image?.form}</span>
              <span className="dot" />
              <span>{image?.isAI ? "AI-envisioned" : "Revealed by a devotee"}</span>
            </div>
            <div className="d-teach">{image?.teachingCaption}</div>
            <button
              className="d-dl"
              onClick={() => image && downloadImage(image)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="M7 11l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Download her darshan
            </button>
            <div className="d-jai">जय माँ</div>
          </div>
        </div>
      </div>
    </>
  );
}
