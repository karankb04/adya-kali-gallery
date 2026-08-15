"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MusicVideo } from "@/content/musicVideos";

interface MusicModalProps {
  video: MusicVideo | null;
  onClose: () => void;
}

const SPRING = { type: "spring", stiffness: 300, damping: 32, mass: 0.9 } as const;

/**
 * Same shared-layout-morph pattern as DarshanModal: the clicked card's
 * thumbnail expands in place into this detail view. The YouTube iframe is
 * only ever created here, on click — nothing plays (or even loads a
 * player) until then.
 */
export default function MusicModal({ video, onClose }: MusicModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = video ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video && (
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
            <div className="music-detail">
              <motion.div
                className="music-detail-frame"
                layoutId={`music-${video.id}`}
                style={{ borderRadius: 14 }}
                transition={SPRING}
              >
                <iframe
                  key={video.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
              <motion.div
                className="music-detail-meta"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
              >
                <div className="music-detail-title">{video.title}</div>
                <div className="music-detail-desc">{video.description}</div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
