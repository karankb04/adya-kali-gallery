"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface FloatingGalleryButtonProps {
  /** Element id of the section to track (the home preview's <section id="library">). */
  sectionId: string;
  href: string;
}

/**
 * A second "Open Gallery" CTA that fades/rises into view once the preview
 * section scrolls into frame, stays pinned to the viewport's bottom-right
 * while you scroll through the grid, then detaches to sit at the section's
 * own bottom-right once you scroll past it (so it doesn't drift into the
 * footer). Reverses cleanly on scroll-up. The static button already in the
 * facet row covers everyone who doesn't scroll far enough to see this one.
 */
export default function FloatingGalleryButton({
  sectionId,
  href,
}: FloatingGalleryButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = document.getElementById(sectionId);
    const btn = btnRef.current;
    if (!section || !btn) return;

    gsap.registerPlugin(ScrollTrigger);

    const t = setTimeout(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom bottom",
        onEnter: () => btn.classList.add("show"),
        onLeaveBack: () => btn.classList.remove("show"),
        onLeave: () => btn.classList.add("settled"),
        onEnterBack: () => btn.classList.remove("settled"),
      });
      ScrollTrigger.refresh();
      (btn as unknown as { __st?: ScrollTrigger }).__st = st;
    });

    return () => {
      clearTimeout(t);
      const st = (btn as unknown as { __st?: ScrollTrigger }).__st;
      st?.kill();
    };
  }, [sectionId]);

  return (
    <Link href={href} ref={btnRef} className="open-gallery-btn open-gallery-float">
      Open Gallery
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
