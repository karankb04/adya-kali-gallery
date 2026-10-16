"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const STATEMENT =
  "She is not hidden. She is the dark that holds every light, the silence beneath every name.";

/**
 * A statement that writes itself in as you scroll — each word lifts from a
 * blurred, dimmed rest state to full weight, staggered across the scroll range.
 *
 * The words are split in JSX rather than by mutating innerHTML, so React stays
 * the owner of the DOM and there's nothing to clean up but the ScrollTrigger.
 */
export default function WordReveal() {
  const wrapRef = useRef<HTMLParagraphElement>(null);
  const words = STATEMENT.split(" ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    let tl: gsap.core.Timeline | undefined;
    const t = setTimeout(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const spans = wrap.querySelectorAll<HTMLElement>(".sc-wr-word");

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          end: "bottom 55%",
          scrub: 0.5,
        },
      });
      tl.to(spans, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.35,
        ease: "none",
      });
      ScrollTrigger.refresh();
    }, 0);

    return () => {
      clearTimeout(t);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <p className="sc-wr" ref={wrapRef}>
      {words.map((w, i) => (
        <span className="sc-wr-word" key={`${w}-${i}`}>
          {w}
        </span>
      ))}
    </p>
  );
}
