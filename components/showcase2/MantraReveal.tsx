"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const DEVA = "॥ जय माँ आद्या काली ॥";
const LATIN = "Jai Maa Adya Kali";

/**
 * Split into grapheme clusters, not JS characters. "माँ" is three code
 * points (म ा ँ); a naive split("") or Array.from() separates the vowel sign
 * and chandrabindu from their consonant, and each piece renders as a broken
 * dotted-circle glyph. Intl.Segmenter keeps every syllable whole.
 */
function graphemes(s: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter("hi", { granularity: "grapheme" });
    return Array.from(seg.segment(s), (x) => x.segment);
  }
  return s.split(" ").flatMap((w, i) => (i ? [" ", w] : [w])); // word fallback
}

export default function MantraReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const deva = graphemes(DEVA);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    let tl: gsap.core.Timeline | undefined;
    const t = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 75%", once: true } });
      tl.fromTo(
        root.querySelectorAll(".s2-mr-g"),
        { opacity: 0, y: "0.5em", filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.07, ease: "power3.out" }
      ).fromTo(
        root.querySelector(".s2-mr-latin"),
        { opacity: 0, letterSpacing: "0.6em" },
        { opacity: 1, letterSpacing: "0.32em", duration: 1.2, ease: "power2.out" },
        "-=0.5"
      );
      ScrollTrigger.refresh();
    }, 0);

    return () => {
      clearTimeout(t);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <div className="s2-mr" ref={rootRef}>
      <p className="s2-mr-deva" aria-label={DEVA}>
        {deva.map((g, i) => (
          <span className="s2-mr-g" key={i} aria-hidden="true">
            {g === " " ? " " : g}
          </span>
        ))}
      </p>
      <p className="s2-mr-latin">{LATIN}</p>
    </div>
  );
}
