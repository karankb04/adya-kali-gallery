"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const LINE = "Jai Maa Adya Mahakali";

/**
 * Two condensed-type ticker rows, each tiled and looping continuously via
 * CSS (same fill-then-clone technique as MantraRibbon), with an outer
 * motion.div on each row adding a scroll-linked horizontal drift — opposite
 * direction per row — as the section transits the viewport. Mirrors the
 * layered structure of motion.dev's "Scroll Text Lines" example, trimmed to
 * 2 rows per the brief.
 */
export default function ScrollTextLines() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const view1Ref = useRef<HTMLDivElement>(null);
  const view2Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  useEffect(() => {
    function fill(
      trackRef: React.RefObject<HTMLDivElement>,
      viewRef: React.RefObject<HTMLDivElement>,
      speed: number
    ) {
      const track = trackRef.current;
      const view = viewRef.current;
      if (!track || !view) return;
      const original = Array.from(track.children);
      track.style.setProperty("--stl-duration", "0s");
      while (track.scrollWidth < view.offsetWidth * 2.2) {
        original.forEach((node) => track.appendChild(node.cloneNode(true)));
      }
      const singleSetWidth = track.scrollWidth / (track.children.length / original.length);
      track.style.setProperty("--stl-duration", `${singleSetWidth / speed}s`);
    }
    fill(track1Ref, view1Ref, 90);
    fill(track2Ref, view2Ref, 90);
    const ro1 = new ResizeObserver(() => fill(track1Ref, view1Ref, 90));
    const ro2 = new ResizeObserver(() => fill(track2Ref, view2Ref, 90));
    if (view1Ref.current) ro1.observe(view1Ref.current);
    if (view2Ref.current) ro2.observe(view2Ref.current);
    return () => {
      ro1.disconnect();
      ro2.disconnect();
    };
  }, []);

  return (
    <div className="stl" ref={sectionRef}>
      <div className="stl-row" ref={view1Ref}>
        <motion.div className="stl-drift" style={{ x: x1 }}>
          <div className="stl-track stl-track-a" ref={track1Ref}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="stl-item stl-item-solid">
                {LINE}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="stl-row" ref={view2Ref}>
        <motion.div className="stl-drift" style={{ x: x2 }}>
          <div className="stl-track stl-track-b" ref={track2Ref}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="stl-item stl-item-outline">
                {LINE}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
