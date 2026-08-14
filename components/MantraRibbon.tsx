"use client";
import { useEffect, useRef } from "react";

const MANTRA = "Jai Maa Adya Mahakali";

/**
 * Same fill-then-clone marquee technique as the /components reference: a CSS
 * @keyframes animation does the actual scrolling; JS only clones the content
 * enough times to fill the track and sets --duration from a px/second speed
 * so visual speed stays constant regardless of viewport width.
 */
export default function MantraRibbon({ speed = 65 }: { speed?: number }) {
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
    <div className="mantra-ribbon" ref={containerRef}>
      <div className="mantra-ribbon-track" ref={trackRef}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mantra-ribbon-item">
            {MANTRA}
            <span className="mantra-ribbon-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
