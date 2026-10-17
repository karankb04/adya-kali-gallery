"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import RImage from "../RImage";
import { sample } from "../showcase/sampleData";

type VTDoc = Document & { startViewTransition?: (cb: () => void) => unknown };

/**
 * Thumbnail -> full darshan using the browser's own View Transitions API.
 * The browser morphs the shared element itself, so this needs no animation
 * library on the page (the live site's modal pulls in Motion for the same
 * effect). Where the API isn't supported the swap is simply instant.
 *
 * Also demonstrates the focus handling the live modal lacks: focus moves into
 * the dialog on open, Escape closes, and focus returns to the thumbnail.
 */
export default function ViewTransitionGallery() {
  const items = sample(6);
  const [open, setOpen] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastThumb = useRef<HTMLButtonElement | null>(null);

  function go(next: string | null) {
    const doc = document as VTDoc;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      setOpen(next);
      return;
    }
    doc.startViewTransition(() => flushSync(() => setOpen(next)));
  }

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && go(null);
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    lastThumb.current?.focus();
  }, [open]);

  const sel = items.find((p) => p.id === open);

  return (
    <div className="s2-vt">
      <div className="s2-vt-grid">
        {items.map((p) => (
          <button
            key={p.id}
            className="s2-vt-thumb"
            onClick={(e) => {
              lastThumb.current = e.currentTarget;
              go(p.id);
            }}
            aria-label={`Open ${p.transliteration}`}
            style={{ viewTransitionName: open === p.id ? "none" : `s2vt-${p.id}` } as React.CSSProperties}
          >
            <RImage
              r2Key={p.r2Key}
              alt=""
              width={p.width}
              height={p.height}
              dominantColor={p.dominantColor}
              sizes="(max-width:760px) 30vw, 180px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      {sel && (
        <div className="s2-vt-dialog" role="dialog" aria-modal="true" aria-label={sel.transliteration} onClick={() => go(null)}>
          <div className="s2-vt-panel" onClick={(e) => e.stopPropagation()}>
            <div className="s2-vt-big" style={{ viewTransitionName: `s2vt-${sel.id}` } as React.CSSProperties}>
              <RImage
                r2Key={sel.r2Key}
                alt={`${sel.transliteration} — ${sel.form}`}
                width={sel.width}
                height={sel.height}
                dominantColor={sel.dominantColor}
                sizes="(max-width:760px) 90vw, 440px"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="s2-vt-meta">
              <p className="s2-vt-deva">{sel.nameDevanagari}</p>
              <h3>{sel.transliteration}</h3>
              <p>{sel.teachingCaption}</p>
              <button ref={closeRef} className="s2-vt-close" onClick={() => go(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
