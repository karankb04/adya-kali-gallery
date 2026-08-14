"use client";
import { useEffect, useRef, useState } from "react";
import RImage from "../RImage";
import { sample } from "./sampleData";

/**
 * A single floating preview element lerps toward the cursor (same
 * follow-the-pointer technique as the magnetic cursor) and swaps its
 * content on row hover. No meaningful "hover" on touch, so it's disabled on
 * coarse pointers and under reduced motion.
 */
export default function PeekPreviewList() {
  const rows = sample(5);
  const [active, setActive] = useState(0);
  const zoneRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled.current) return;

    const zone = zoneRef.current;
    const preview = previewRef.current;
    if (!zone || !preview) return;

    let mx = 0,
      my = 0,
      px = 0,
      py = 0,
      raf = 0;

    function onMove(e: MouseEvent) {
      const rect = zone!.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }
    function tick() {
      px += (mx - px) * 0.15;
      py += (my - py) * 0.15;
      if (preview) preview.style.transform = `translate(${px}px, ${py}px) translate(-50%, -65%)`;
      raf = requestAnimationFrame(tick);
    }
    zone.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      zone.removeEventListener("mousemove", onMove);
    };
  }, []);

  const current = rows[active];

  return (
    <div className="sc-peek" ref={zoneRef}>
      <div className="sc-peek-list">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={`sc-peek-row${i === active ? " on" : ""}`}
            onMouseEnter={() => setActive(i)}
          >
            <span className="sc-peek-tr">{r.transliteration}</span>
            <span className="sc-peek-form">{r.form}</span>
          </div>
        ))}
      </div>
      <div className="sc-peek-preview" ref={previewRef}>
        <RImage
          key={current.id}
          r2Key={current.r2Key}
          alt={current.transliteration}
          width={current.width}
          height={current.height}
          dominantColor={current.dominantColor}
          sizes="180px"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
