"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import RImage from "../RImage";
import { sample } from "./sampleData";

// px ranges pulled from a fixed array, alternating direction by index — the
// "different speed" effect comes entirely from each card having a different
// tween range over the same scroll distance, not a special API.
const RANGES = [28, 120, 42, 160, 34, 140, 80];
const EASES = ["power1.out", "none", "power2.inOut", "none", "power1.inOut", "none", "power2.out"];

export default function ParallaxWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const items = sample(7);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const t = setTimeout(() => {
      const wall = wallRef.current;
      if (!wall) return;
      const cards = Array.from(wall.querySelectorAll<HTMLElement>(".sc-wall-card"));
      const triggers = cards.map((card, i) => {
        const range = RANGES[i % RANGES.length];
        const dir = i % 2 ? 1 : -1;
        return gsap.fromTo(
          card,
          { y: -range * dir },
          {
            y: range * dir,
            ease: EASES[i % EASES.length],
            scrollTrigger: {
              trigger: wall,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.75,
            },
          }
        );
      });
      return () => triggers.forEach((tw) => tw.scrollTrigger?.kill());
    }, 0);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="sc-wall" ref={wallRef}>
      {items.map((p) => (
        <div key={p.id} className="sc-wall-card">
          <RImage
            r2Key={p.r2Key}
            alt={p.transliteration}
            width={p.width}
            height={p.height}
            dominantColor={p.dominantColor}
            sizes="(max-width:760px) 30vw, 180px"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}
