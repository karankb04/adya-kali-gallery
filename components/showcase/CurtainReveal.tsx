"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import RImage from "../RImage";
import { sample } from "./sampleData";

/**
 * The frame widens open as it enters view while the image inside counter-scales
 * down — a "curtain" wipe.
 *
 * The counter-scale is the whole trick: without it the image appears to grow
 * with the frame and the reveal reads as a zoom instead of an unveiling.
 * clip-path animates on the compositor, so this stays cheap.
 */
export default function CurtainReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [img] = sample(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    let tl: gsap.core.Timeline | undefined;
    const t = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      const frame = root.querySelector<HTMLElement>(".sc-cr-frame");
      const inner = root.querySelector<HTMLElement>(".sc-cr-inner");
      const cap = root.querySelector<HTMLElement>(".sc-cr-cap");
      if (!frame || !inner) return;

      tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 60%", scrub: 0.6 },
      });
      tl.fromTo(
        frame,
        { clipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none" },
        0
      )
        .fromTo(inner, { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
        .fromTo(cap, { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: "none" }, 0.5);

      ScrollTrigger.refresh();
    }, 0);

    return () => {
      clearTimeout(t);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <div className="sc-cr" ref={rootRef}>
      <div className="sc-cr-frame">
        <div className="sc-cr-inner">
          <RImage
            r2Key={img.r2Key}
            alt={img.transliteration}
            width={img.width}
            height={img.height}
            dominantColor={img.dominantColor}
            sizes="(max-width:900px) 92vw, 780px"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
      <div className="sc-cr-cap">{img.teachingCaption}</div>
    </div>
  );
}
