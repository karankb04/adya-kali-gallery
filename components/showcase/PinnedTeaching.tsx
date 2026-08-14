"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { sample } from "./sampleData";

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
  const forms = sample(9);

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
        });
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
        <span className="sc-pin-deva">शिक्षा</span>
        <h3>One teaching, held in place</h3>
        <p>
          The column pins while her nine forms scroll past beside it — the
          text stays put so the reader keeps their place while skimming a
          longer list.
        </p>
      </div>
      <div className="sc-pin-list">
        {forms.map((f) => (
          <div key={f.id} className="sc-pin-row">
            <span className="sc-pin-row-name">{f.nameDevanagari}</span>
            <span className="sc-pin-row-tr">{f.transliteration}</span>
            <span className="sc-pin-row-cap">{f.teachingCaption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
