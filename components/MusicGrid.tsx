"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { MUSIC_VIDEOS, MusicVideo } from "@/content/musicVideos";
import MusicModal from "./MusicModal";

export default function MusicGrid() {
  const [active, setActive] = useState<MusicVideo | null>(null);

  return (
    <>
      <div className="music-grid">
        {MUSIC_VIDEOS.map((v) => (
          <button
            key={v.id}
            className="music-card"
            aria-label={`Play ${v.title}`}
            onClick={() => setActive(v)}
          >
            <motion.div
              className="music-card-media"
              layoutId={`music-${v.id}`}
              style={{ borderRadius: 12 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt={v.title}
                loading="lazy"
              />
              <span className="music-card-scrim" aria-hidden="true" />
              <div className="music-card-overlay">
                <span className="music-card-title">{v.title}</span>
                <span className="music-card-desc">{v.description}</span>
              </div>
              <span className="music-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="20">
                  <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
                </svg>
              </span>
            </motion.div>
          </button>
        ))}
      </div>
      <MusicModal video={active} onClose={() => setActive(null)} />
    </>
  );
}
