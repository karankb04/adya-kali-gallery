"use client";
import { useEffect, useRef } from "react";
import RImage from "../RImage";
import { SAMPLE_IMAGES } from "./sampleData";

/**
 * Prefers the native `animation-timeline: view()` (zero JS, runs off the
 * compositor) and only falls back to a rAF + getBoundingClientRect loop when
 * the browser doesn't support it.
 */
export default function ParallaxPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const portrait = SAMPLE_IMAGES[10] ?? SAMPLE_IMAGES[0];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()")) {
      return; // handled entirely by CSS
    }

    let raf = 0;
    const el = imgWrapRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    function tick() {
      if (!el || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      const progress = 1 - (rect.top + rect.height / 2) / window.innerHeight;
      const travel = 16; // percent of vertical travel, matches --parallax-amount
      el.style.transform = `translateY(${(progress - 0.5) * travel}%)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="sc-parallax" ref={wrapRef}>
      <div className="sc-parallax-img" ref={imgWrapRef}>
        <RImage
          r2Key={portrait.r2Key}
          alt={portrait.transliteration}
          width={portrait.width}
          height={portrait.height}
          dominantColor={portrait.dominantColor}
          sizes="(max-width:760px) 90vw, 520px"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="sc-parallax-text">
        <p>
          {portrait.teachingCaption}
        </p>
        <span className="sc-parallax-name">{portrait.transliteration} — {portrait.form}</span>
      </div>
    </div>
  );
}
