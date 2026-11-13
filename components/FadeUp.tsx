"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * One simple, quiet entrance for the home page: anything marked .fade-up
 * rises 24px and fades in once, the first time it scrolls into view.
 */
export default function FadeUp({ selector = ".site2 .fade-up" }: { selector?: string }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(selector, { opacity: 0, y: 24 });
      ScrollTrigger.batch(selector, {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.06 }),
      });
    });
    return () => ctx.revert();
  }, [selector]);
  return null;
}
