"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KaliImage } from "@/types/image";
import { downloadImage } from "@/lib/download";
import RImage from "./RImage";

interface DarshanModalProps {
  image: KaliImage | null;
  onClose: () => void;
  /** Navigate to the previous/next darshan in the current filtered set. */
  onPrev?: () => void;
  onNext?: () => void;
}

const SPRING = { type: "spring", stiffness: 300, damping: 32, mass: 0.9 } as const;

/**
 * When `image` is one of the currently-rendered gallery cards, this frame
 * shares that card's layoutId — Motion morphs it from the card's exact grid
 * position/size into the full detail view, App Store-style. If there's no
 * matching card mounted (e.g. opened from the Hero wall, whose repeated
 * tiles can't safely carry a unique layoutId), it just fades in normally —
 * layoutId degrades gracefully when nothing matches.
 */
export default function DarshanModal({
  image,
  onClose,
  onPrev,
  onNext,
}: DarshanModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = image ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [image, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {image && (
        <>
          <motion.button
            key="mclose"
            className="mclose"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            ✕
          </motion.button>

          {onPrev && (
            <motion.button
              key="mprev"
              className="mnav mprev"
              aria-label="Previous darshan"
              onClick={onPrev}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
          )}
          {onNext && (
            <motion.button
              key="mnext"
              className="mnav mnext"
              aria-label="Next darshan"
              onClick={onNext}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </motion.button>
          )}

          <motion.div
            key="modal"
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="darshan">
              <motion.div
                className="frame"
                layoutId={`darshan-img-${image.id}`}
                style={{ borderRadius: 10 }}
                transition={SPRING}
              >
                <RImage
                  key={image.id}
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
              </motion.div>
              <motion.div
                className="meta"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
              >
                <div className="d-deva">{image.nameDevanagari}</div>
                <div className="d-tr">{image.transliteration}</div>
                <div className="d-fm">
                  <span>{image.form}</span>
                  <span className="dot" />
                  <span>{image.isAI ? "AI-envisioned" : "Revealed by a devotee"}</span>
                </div>
                <div className="d-teach">{image.teachingCaption}</div>
                <button className="d-dl" onClick={() => downloadImage(image)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v12" />
                    <path d="M7 11l5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                  Download her darshan
                </button>
                <div className="d-jai">जय माँ</div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
