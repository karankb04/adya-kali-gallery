"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import RImage from "../RImage";
import { sample } from "./sampleData";

/**
 * Vertical scroll drives horizontal movement: the section pins, and the inner
 * track slides left by exactly its overflow width.
 *
 * Two rules that make or break this pattern:
 *  - the moving element must be a CHILD of the pinned element (never animate
 *    the pinned node itself), and
 *  - the tween must use `ease: "none"` or scroll position and horizontal
 *    position stop lining up 1:1.
 */
export default function HorizontalScroll() {
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const items = sample(8);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 760px)", () => {
      let tween: gsap.core.Tween | undefined;
      const t = setTimeout(() => {
        const frame = frameRef.current;
        const track = trackRef.current;
        if (!frame || !track) return;

        tween = gsap.to(track, {
          x: () => Math.min(0, frame.offsetWidth - track.scrollWidth),
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            pin: true,
            start: "center center",
            end: () => "+=" + Math.max(1, track.scrollWidth - frame.offsetWidth),
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        ScrollTrigger.refresh();
      }, 0);

      return () => {
        clearTimeout(t);
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="sc-hs" ref={frameRef}>
      <div className="sc-hs-track" ref={trackRef}>
        {items.map((p, i) => (
          <figure className="sc-hs-card" key={p.id}>
            <span className="sc-hs-num">{String(i + 1).padStart(2, "0")}</span>
            <div className="sc-hs-media">
              <RImage
                r2Key={p.r2Key}
                alt={p.transliteration}
                width={p.width}
                height={p.height}
                dominantColor={p.dominantColor}
                sizes="(max-width:760px) 70vw, 340px"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <figcaption>{p.transliteration}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
