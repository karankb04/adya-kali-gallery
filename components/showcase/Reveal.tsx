"use client";
import { createElement, useEffect, useRef } from "react";

type RevealVariant = "up" | "mask" | "zoom" | "chars" | "fade";

interface RevealProps {
  variant?: RevealVariant;
  /** ms delay before this element's own transition starts (stagger). */
  delay?: number;
  className?: string;
  tag?: string;
  children: React.ReactNode;
}

/**
 * Fire-once scroll reveal. A single shared IntersectionObserver per variant
 * group would be more efficient at scale, but a page of hand-picked demo
 * sections doesn't need that — one observer per instance is simpler and the
 * cost is negligible here.
 *
 * threshold MUST stay 0: an element mid clip-path collapse reports
 * intersectionRatio 0 even while isIntersecting is true, so any positive
 * threshold silently drops "mask"/"zoom" variants in Chromium.
 */
export default function Reveal({
  variant = "up",
  delay = 0,
  className,
  tag = "div",
  children,
}: RevealProps) {
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return createElement(
    tag,
    {
      ref: (el: HTMLElement | null) => {
        elRef.current = el;
      },
      className: `sc-reveal sc-reveal--${variant}${className ? ` ${className}` : ""}`,
    },
    children
  );
}
