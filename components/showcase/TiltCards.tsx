"use client";
import { useRef } from "react";
import RImage from "../RImage";
import { sample } from "./sampleData";

const MAX_TILT = 11; // degrees

/**
 * Cards that tilt toward the pointer in 3D, with a specular sheen that tracks
 * the same position.
 *
 * Values are written to CSS custom properties and the transform lives in CSS —
 * so the browser can keep the whole thing on the compositor, and the reset on
 * mouse-leave is a plain CSS transition rather than a JS animation to unwind.
 */
export default function TiltCards() {
  const items = sample(3);
  const frame = useRef(0);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    // Coalesce to one write per frame — mousemove can fire far more often.
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${(0.5 - py) * MAX_TILT * 2}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * MAX_TILT * 2}deg`);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    });
  }

  function onLeave(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="sc-tilt-row">
      {items.map((p) => (
        <div className="sc-tilt" key={p.id} onMouseMove={onMove} onMouseLeave={onLeave}>
          <div className="sc-tilt-inner">
            <RImage
              r2Key={p.r2Key}
              alt={p.transliteration}
              width={p.width}
              height={p.height}
              dominantColor={p.dominantColor}
              sizes="(max-width:760px) 80vw, 260px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span className="sc-tilt-sheen" />
            <span className="sc-tilt-name">{p.transliteration}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
