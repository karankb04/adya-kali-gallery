"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ENGAGE_LINKS } from "@/content/engageLinks";
import EngageIcon from "./EngageIcons";

/**
 * A sidebar column stays fixed while a taller sibling list scrolls past it.
 *
 * The gotcha that matters if you reuse this: `end: "bottom bottom"` looks
 * like the obvious formula but fires almost immediately whenever the
 * trigger area is shorter than the viewport. The correct end is the actual
 * scroll distance the pin needs to cover — the list's height minus the
 * sticky column's own height.
 *
 * Scoped to >=1200px via gsap.matchMedia(); a CSS `position: sticky`
 * fallback (the .sc-pin-fallback class, active by default) covers narrower
 * viewports and any environment where GSAP fails to load.
 */
export default function PinnedTeaching() {
  const areaRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1200px)", () => {
      let st: ScrollTrigger | undefined;
      const t = setTimeout(() => {
        const area = areaRef.current;
        const sticky = stickyRef.current;
        if (!area || !sticky) return;
        area.classList.add("sc-pin-gsap");

        st = ScrollTrigger.create({
          trigger: area,
          pin: sticky,
          pinSpacing: false,
          start: "top 100px",
          end: () => "+=" + Math.max(200, area.offsetHeight - sticky.offsetHeight),
          invalidateOnRefresh: true,
        });
        // Under React StrictMode's dev-only double-invoke (mount -> cleanup
        // -> mount), creating this synchronously in the same tick as the
        // prior instance's teardown can measure a not-yet-settled layout,
        // collapsing the computed pin range to zero. Forcing a refresh here
        // (same fix applied to the Katha carousel and floating gallery
        // button elsewhere in this codebase) re-measures against the
        // now-settled DOM.
        ScrollTrigger.refresh();
      }, 0);
      return () => {
        clearTimeout(t);
        st?.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="sc-pin-area" ref={areaRef}>
      <div className="sc-pin-sticky" ref={stickyRef}>
        <span className="sc-pin-deva">जुड़ें</span>
        <h3>Nine ways to walk with her</h3>
        <p>
          The column pins while the ways to reach the mission scroll past
          beside it — watch, listen, read, or join, whichever calls you.
        </p>
      </div>
      <div className="sc-pin-list">
        {ENGAGE_LINKS.map((link) => (
          <a
            key={link.id}
            className="sc-pin-row"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sc-pin-row-icon">
              <EngageIcon id={link.id} />
            </span>
            <span className="sc-pin-row-body">
              <span className="sc-pin-row-label">{link.label}</span>
              <span className="sc-pin-row-desc">{link.description}</span>
            </span>
            <span className="sc-pin-row-arrow" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" width="16">
                <path
                  d="M4 12L12 4M12 4H5.5M12 4V10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
