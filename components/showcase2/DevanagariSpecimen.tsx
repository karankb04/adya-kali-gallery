"use client";
import { useEffect } from "react";

const SAMPLE = "॥ जय माँ आद्या काली ॥";

const FACES = [
  { name: "Mukta", css: "'Mukta', sans-serif", weight: 600, role: "In use now", note: "Clean and legible, but plain. Reads like interface text, not a prayer." },
  { name: "Tiro Devanagari Hindi", css: "'Tiro Devanagari Hindi', serif", weight: 400, role: "Recommended: headlines", note: "Calligraphic, with the stroke contrast of hand-lettered scripture. Has a true italic. The strongest devotional voice of the set." },
  { name: "Kadwa", css: "'Kadwa', serif", weight: 700, role: "Alt: headlines", note: "Bold, traditional book serif. Weighty enough to stand beside Clash Display." },
  { name: "Sura", css: "'Sura', serif", weight: 700, role: "Alt: body + labels", note: "Calm and balanced; good for longer Hindi passages and verse blocks." },
  { name: "Sumana", css: "'Sumana', serif", weight: 700, role: "Alt: verse blocks", note: "Softer, rounder serif with a warm, old-print feel." },
  { name: "Asar", css: "'Asar', serif", weight: 400, role: "Alt: display only", note: "High-contrast and dramatic. Only for large sizes; too fine for small text." },
];

/**
 * Candidate Devanagari faces set in the site's own mantra.
 *
 * Loaded with Google Fonts' `text=` parameter, which returns only the glyphs
 * that string needs: a few KB per face instead of a full Devanagari file
 * (often 100 KB+). The live site could use the same trick for headline-only
 * Devanagari.
 */
export default function DevanagariSpecimen() {
  useEffect(() => {
    const families = ["Tiro+Devanagari+Hindi", "Kadwa:wght@700", "Sura:wght@700", "Sumana:wght@700", "Asar"]
      .map((f) => `family=${f}`)
      .join("&");
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = `https://fonts.googleapis.com/css2?${families}&text=${encodeURIComponent(SAMPLE)}&display=swap`;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  return (
    <div className="s2-dev">
      {FACES.map((f) => (
        <div className="s2-dev-row" key={f.name}>
          <p className="s2-dev-sample" style={{ fontFamily: f.css, fontWeight: f.weight }} lang="hi">
            {SAMPLE}
          </p>
          <div className="s2-dev-meta">
            <span className="s2-dev-name">{f.name}</span>
            <span className="s2-dev-role">{f.role}</span>
            <span className="s2-dev-note">{f.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
