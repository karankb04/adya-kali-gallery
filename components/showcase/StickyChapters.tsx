"use client";
import { useEffect, useRef, useState } from "react";
import RImage from "../RImage";
import { sample } from "./sampleData";

/**
 * One image column holds still while text chapters scroll past it; the image
 * cross-fades whenever a new chapter takes the middle of the viewport.
 *
 * Uses position:sticky for the hold (no pin library needed) and a single
 * IntersectionObserver with a mid-viewport rootMargin band to decide which
 * chapter is "current" — cheaper and less brittle than measuring on scroll.
 */
export default function StickyChapters() {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const items = sample(4);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>(".sc-ch-step"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = chapters.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      // A thin band across the middle of the viewport: whichever chapter
      // crosses it becomes active.
      { rootMargin: "-50% 0px -45% 0px", threshold: 0 }
    );

    chapters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <div className="sc-ch" ref={rootRef}>
      <div className="sc-ch-media-col">
        <div className="sc-ch-media">
          {items.map((p, i) => (
            <div
              key={p.id}
              className={`sc-ch-layer${i === active ? " on" : ""}`}
              aria-hidden={i !== active}
            >
              <RImage
                r2Key={p.r2Key}
                alt={p.transliteration}
                width={p.width}
                height={p.height}
                dominantColor={p.dominantColor}
                sizes="(max-width:900px) 90vw, 420px"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
          <div className="sc-ch-count">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="sc-ch-steps">
        {items.map((p, i) => (
          <div key={p.id} className={`sc-ch-step${i === active ? " on" : ""}`}>
            <span className="sc-ch-deva">{p.nameDevanagari}</span>
            <h3>{p.transliteration}</h3>
            <p>{p.teachingCaption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
