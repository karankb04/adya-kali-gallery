"use client";
import { useEffect, useRef } from "react";
import { MANTRA } from "./sampleData";

interface MantraMarqueeProps {
  speed?: number; // px/second
  direction?: "left" | "right";
}

/**
 * A CSS @keyframes animation does the actual translation; JS's only job is
 * cloning the content enough times to fill the track (so the loop never
 * shows a gap) and setting --duration from a px/second speed so visual
 * speed stays constant regardless of how much text is in it.
 */
export default function MantraMarquee({ speed = 70, direction = "left" }: MantraMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const original = Array.from(track.children);
    function fill() {
      if (!track || !container) return;
      track.style.setProperty("--duration", "0s");
      while (track.scrollWidth < container.offsetWidth * 2.2) {
        original.forEach((node) => track!.appendChild(node.cloneNode(true)));
      }
      const singleSetWidth = track.scrollWidth / (track.children.length / original.length);
      track.style.setProperty("--duration", `${singleSetWidth / speed}s`);
    }
    fill();
    const ro = new ResizeObserver(fill);
    ro.observe(container);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div className="sc-marquee" ref={containerRef} data-direction={direction}>
      <div className="sc-marquee-track" ref={trackRef}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="sc-marquee-item">
            {MANTRA}
          </span>
        ))}
      </div>
    </div>
  );
}
