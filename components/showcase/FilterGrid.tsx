"use client";
import { useMemo, useRef, useState } from "react";
import RImage from "../RImage";
import { SAMPLE_IMAGES } from "./sampleData";

/**
 * On filter click, records every visible item's rect BEFORE the DOM updates,
 * then after React re-renders, computes the delta between old and new
 * position and plays it back as a FLIP animation via the native
 * Element.animate() WAAPI — no animation library needed for this.
 */
export default function FilterGrid() {
  const items = SAMPLE_IMAGES.slice(0, 12);
  const forms = useMemo(() => {
    const out: string[] = [];
    items.forEach((p) => {
      if (!out.includes(p.form)) out.push(p.form);
    });
    return out;
  }, [items]);

  const [active, setActive] = useState("*");
  const gridRef = useRef<HTMLDivElement>(null);
  const rectsBefore = useRef<Map<string, DOMRect>>(new Map());

  function recordRects() {
    const grid = gridRef.current;
    if (!grid) return;
    const map = new Map<string, DOMRect>();
    grid.querySelectorAll<HTMLElement>("[data-fid]").forEach((el) => {
      map.set(el.dataset.fid!, el.getBoundingClientRect());
    });
    rectsBefore.current = map;
  }

  function playFlip() {
    const grid = gridRef.current;
    if (!grid) return;
    requestAnimationFrame(() => {
      grid.querySelectorAll<HTMLElement>("[data-fid]").forEach((el) => {
        const before = rectsBefore.current.get(el.dataset.fid!);
        if (!before) return;
        const after = el.getBoundingClientRect();
        const dx = before.left - after.left;
        const dy = before.top - after.top;
        if (!dx && !dy) return;
        el.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: "translate(0, 0)" },
          ],
          { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      });
    });
  }

  function setFilter(form: string) {
    recordRects();
    setActive(form);
    playFlip();
  }

  const visible = active === "*" ? items : items.filter((p) => p.form === active);
  const visibleIds = new Set(visible.map((p) => p.id));

  return (
    <div>
      <div className="sc-fbar">
        <button className={`sc-chip${active === "*" ? " on" : ""}`} onClick={() => setFilter("*")}>
          All forms
        </button>
        {forms.map((f) => (
          <button key={f} className={`sc-chip${active === f ? " on" : ""}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <div className="sc-fgrid" ref={gridRef}>
        {items.map((p) => (
          <div
            key={p.id}
            data-fid={p.id}
            className="sc-fgrid-item"
            hidden={!visibleIds.has(p.id)}
          >
            <RImage
              r2Key={p.r2Key}
              alt={p.transliteration}
              width={p.width}
              height={p.height}
              dominantColor={p.dominantColor}
              sizes="(max-width:760px) 45vw, 200px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
