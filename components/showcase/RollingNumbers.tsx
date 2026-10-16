"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 108, label: "Names chanted" },
  { value: 22, label: "Darshan in the library" },
  { value: 9, label: "Forms of the Mother" },
];

/** Digits 0-9 stacked in a column; the column slides to show the target digit. */
function Reel({ digit, delay, run }: { digit: number; delay: number; run: boolean }) {
  return (
    <span className="sc-rn-reel">
      <span
        className="sc-rn-strip"
        style={{
          transform: `translateY(${run ? -digit * 10 : 0}%)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

/**
 * Mechanical odometer counter — each digit is its own reel of 0-9 that slides
 * to its target, with a per-digit delay so they land left-to-right.
 *
 * Different feel from a tweened count-up (which shows every intermediate
 * number): here the digits physically roll into place. CSS transform does the
 * work; JS only flips a boolean once the row is in view.
 */
export default function RollingNumbers() {
  const [run, setRun] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div className="sc-rn" ref={rootRef}>
      {STATS.map((s) => {
        const digits = String(s.value).split("");
        return (
          <div className="sc-rn-item" key={s.label}>
            <div className="sc-rn-value">
              {digits.map((d, i) => (
                <Reel key={i} digit={Number(d)} delay={i * 140} run={run} />
              ))}
            </div>
            <div className="sc-rn-label">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
