"use client";
import { useState } from "react";
import RImage from "../RImage";
import { sample } from "./sampleData";

/**
 * Horizontal panels that expand on hover (click on touch). Pure flex-grow
 * transition — no JS measuring, no FLIP, so it stays smooth at any panel count.
 *
 * Labels are rotated vertical while collapsed and snap horizontal when open,
 * which is what makes the row readable at rest instead of a wall of slivers.
 */
export default function ExpandPanels() {
  const [open, setOpen] = useState(0);
  const items = sample(5);

  return (
    <div className="sc-ep">
      {items.map((p, i) => (
        <button
          key={p.id}
          className={`sc-ep-panel${i === open ? " on" : ""}`}
          onMouseEnter={() => setOpen(i)}
          onFocus={() => setOpen(i)}
          onClick={() => setOpen(i)}
          aria-label={p.transliteration}
        >
          <RImage
            r2Key={p.r2Key}
            alt=""
            width={p.width}
            height={p.height}
            dominantColor={p.dominantColor}
            sizes="(max-width:760px) 60vw, 420px"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span className="sc-ep-scrim" />
          <span className="sc-ep-label">
            <span className="sc-ep-deva">{p.nameDevanagari}</span>
            <span className="sc-ep-tr">{p.transliteration}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
