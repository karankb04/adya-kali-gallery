"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const TEXT = "॥ जय माँ आद्या काली ॥ JAI MAA ADYA KALI ";

/**
 * A rotating seal: text set on an SVG circular path, spinning slowly on its own
 * and given an extra push by scroll.
 *
 * Two layered rotations rather than one — a CSS keyframe handles the idle spin,
 * and GSAP scrubs a second rotation on the wrapper. Keeping them on separate
 * elements means neither fights the other for the transform property.
 */
export default function CircularBadge() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    let tween: gsap.core.Tween | undefined;
    const t = setTimeout(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      tween = gsap.fromTo(
        wrap,
        { rotate: -45 },
        {
          rotate: 45,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );
      ScrollTrigger.refresh();
    }, 0);

    return () => {
      clearTimeout(t);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div className="sc-badge">
      <div className="sc-badge-scrollspin" ref={wrapRef}>
        <svg viewBox="0 0 220 220" className="sc-badge-svg" aria-hidden="true">
          <defs>
            <path
              id="sc-badge-path"
              d="M110,110 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"
              fill="none"
            />
          </defs>
          <text className="sc-badge-text">
            <textPath href="#sc-badge-path" startOffset="0%">
              {TEXT.repeat(2)}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="sc-badge-core" aria-hidden="true">
        ✦
      </div>
      <span className="sr-only">Jai Maa Adya Kali</span>
    </div>
  );
}
