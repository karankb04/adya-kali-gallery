"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import RImage from "./RImage";

export interface CoverflowItem {
  r2Key: string;
  width?: number;
  height?: number;
  dominantColor?: string;
  label: string;
}

const MAX_ROTATE = 22;
const MIN_SCALE = 0.82;
const MIN_OPACITY = 0.45;
const SPRING = { type: "spring", stiffness: 300, damping: 32 } as const;

/**
 * Matches motion.dev/ui/components/coverflow's spec: 1200px perspective,
 * neighbors rotate up to 22deg on the Y axis, shrink to 0.82x, fade to 45%
 * opacity at full recede. Center card is untransformed and on top.
 */
export default function Coverflow({ items }: { items: CoverflowItem[] }) {
  const [active, setActive] = useState(Math.floor(items.length / 2));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setActive((a) => Math.max(0, a - 1));
      if (e.key === "ArrowRight") setActive((a) => Math.min(items.length - 1, a + 1));
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [items.length]);

  return (
    <div className="coverflow">
      <div
        className="coverflow-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Coverflow"
      >
        {items.map((item, i) => {
          const offset = i - active;
          const abs = Math.abs(offset);
          const sign = Math.sign(offset);
          return (
            <motion.button
              key={item.label}
              type="button"
              className="coverflow-card"
              aria-label={item.label}
              aria-current={offset === 0}
              onClick={() => setActive(i)}
              animate={{
                x: offset * 150,
                rotateY: -sign * Math.min(MAX_ROTATE, abs * MAX_ROTATE),
                scale: abs === 0 ? 1 : Math.max(MIN_SCALE, 1 - abs * 0.13),
                opacity: abs === 0 ? 1 : Math.max(MIN_OPACITY, 1 - abs * 0.28),
                zIndex: items.length - abs,
              }}
              transition={SPRING}
            >
              <RImage
                r2Key={item.r2Key}
                alt={item.label}
                width={item.width}
                height={item.height}
                dominantColor={item.dominantColor}
                sizes="300px"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="coverflow-cap">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="coverflow-nav">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setActive((a) => Math.max(0, a - 1))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="coverflow-dots">
          {items.map((item, i) => (
            <button
              key={item.label}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`coverflow-dot${i === active ? " on" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setActive((a) => Math.min(items.length - 1, a + 1))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <div className="sr-only" aria-live="polite">
        Showing slide {active + 1} of {items.length}: {items[active]?.label}
      </div>
    </div>
  );
}
