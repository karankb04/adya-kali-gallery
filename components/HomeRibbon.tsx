"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * Homepage mantra ribbon (from mockup 1): a slightly tilted black band
 * between the hero and the yellow Maa video. It slides sideways as you
 * scroll past it. The About page keeps the original MantraRibbon.
 */
const UNIT = (
  <>
    <span lang="hi">जय माँ काली</span>
    <span className="hr-sep">✦</span>
    <span>
      Jai Maa <em className="it">Kali</em>
    </span>
    <span className="hr-sep">✦</span>
    <span lang="hi">आद्या महाकाली</span>
    <span className="hr-sep">✦</span>
    <span>
      Mother of infinite <em className="it">forms</em>
    </span>
    <span className="hr-sep">✦</span>
  </>
);

export default function HomeRibbon() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -25,
        ease: "none",
        scrollTrigger: { trigger: wrapRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    // Outer wrapper clips the tilted band's corners so it never widens the page.
    <div className="home-ribbon-clip">
      <div className="home-ribbon" ref={wrapRef} aria-label="Jai Maa Kali — Mother of infinite forms">
        <div className="home-ribbon-track" ref={trackRef} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="home-ribbon-unit">
              {UNIT}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
