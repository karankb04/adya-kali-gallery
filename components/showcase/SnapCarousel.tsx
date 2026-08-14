"use client";
import { useRef, useState } from "react";
import RImage from "../RImage";
import { sample } from "./sampleData";

/**
 * Native `scroll-snap-type: x mandatory` does the actual sliding — JS only
 * adds prev/next buttons and dot pagination. Slides-per-view is driven by a
 * container query on .sc-carousel-viewport (a child of the scroller), never
 * on the scroller itself — @container styles a container's descendants,
 * never the container element, so the --per property has to live one level
 * down or it silently has no effect.
 */
export default function SnapCarousel() {
  const items = sample(8);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(i: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slide = viewport.children[i] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function onScroll() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slide = viewport.children[0] as HTMLElement | undefined;
    if (!slide) return;
    const slideW = slide.getBoundingClientRect().width + 14;
    setActive(Math.round(viewport.scrollLeft / slideW));
  }

  return (
    <div className="sc-carousel">
      <div className="sc-carousel-viewport" ref={viewportRef} onScroll={onScroll}>
        {items.map((p) => (
          <div key={p.id} className="sc-carousel-slide">
            <RImage
              r2Key={p.r2Key}
              alt={p.transliteration}
              width={p.width}
              height={p.height}
              dominantColor={p.dominantColor}
              sizes="(max-width:760px) 78vw, 300px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span className="sc-carousel-cap">{p.transliteration}</span>
          </div>
        ))}
      </div>
      <div className="sc-carousel-nav">
        <button aria-label="Previous" onClick={() => goTo(Math.max(0, active - 1))}>
          ←
        </button>
        <div className="sc-carousel-dots">
          {items.map((p, i) => (
            <button
              key={p.id}
              aria-label={`Go to slide ${i + 1}`}
              className={`sc-dot${i === active ? " on" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button aria-label="Next" onClick={() => goTo(Math.min(items.length - 1, active + 1))}>
          →
        </button>
      </div>
    </div>
  );
}
