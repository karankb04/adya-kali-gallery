"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

/**
 * Technique 1: clip-path mask reveal on the headline (pure CSS, IO-driven).
 * Technique 2 (bonus): a Devanagari line drifts diagonally and fades as you
 * scroll past — two independent scrub tweens on the same element, since the
 * drift and the fade cover different scroll ranges.
 */
export default function KineticHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const t = setTimeout(() => {
      const wrap = wrapRef.current;
      const line = lineRef.current;
      if (!wrap || !line) return;

      const rect = wrap.getBoundingClientRect();
      const endX = rect.width * 0.42;
      const endY = -40;

      gsap.fromTo(
        line,
        { x: 0, y: 0 },
        {
          x: endX,
          y: endY,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 70%",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
      gsap.fromTo(
        line,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "center center",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, 0);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="sc-hero" ref={wrapRef}>
      <Reveal variant="mask" tag="h1" className="sc-hero-line">
        Component Reference
      </Reveal>
      <Reveal variant="mask" delay={120} tag="h1" className="sc-hero-line sc-hero-line--accent">
        for Maa Adya Kali
      </Reveal>
      <div className="sc-hero-drift" ref={lineRef}>
        कला रूप निराकार — every form, one motion
      </div>
    </div>
  );
}
