"use client";
import { useEffect } from "react";

/**
 * Font + text-treatment reference. Candidate faces load from a <link> injected
 * into <head> rather than an @import inside the stylesheet: an @import is only
 * honoured when it is the very first rule in a CSS file, so appending one after
 * compiled Tailwind output gets silently dropped.
 *
 * Everything here is scoped to .sc-ts-* and only rendered on this page — none
 * of these faces are loaded by the live site.
 */
const FONT_HREFS = [
  "https://api.fontshare.com/v2/css?f[]=boska@400,700&f[]=zodiak@400,700&f[]=cabinet-grotesk@700,800&f[]=general-sans@300,400,600&display=swap",
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
];

const FACES = [
  {
    css: "'Clash Display', sans-serif",
    name: "Clash Display",
    role: "In use — display / headings",
    note: "Bold geometric. Reads loud at size, holds up in all-caps.",
    weight: 700,
  },
  {
    css: "'Cabinet Grotesk', sans-serif",
    name: "Cabinet Grotesk",
    role: "Alt display",
    note: "Slightly warmer and rounder than Clash — same energy, less severe.",
    weight: 800,
  },
  {
    css: "'Boska', serif",
    name: "Boska",
    role: "Display serif",
    note: "Extreme thick/thin contrast. Dramatic and devotional at large sizes only.",
    weight: 700,
  },
  {
    css: "'Zodiak', serif",
    name: "Zodiak",
    role: "Editorial serif",
    note: "Characterful serif with real personality — good for katha titles.",
    weight: 700,
  },
  {
    css: "'Instrument Serif', serif",
    name: "Instrument Serif",
    role: "High-contrast display",
    note: "Tight, modern editorial. Its italic is the interesting one.",
    weight: 400,
  },
  {
    css: "'General Sans', sans-serif",
    name: "General Sans",
    role: "Alt body",
    note: "Neutral, quiet, very legible — an alternative to the Roboto Slab body.",
    weight: 400,
  },
];

export default function TypeSpecimen() {
  useEffect(() => {
    const links = FONT_HREFS.map((href) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
      return l;
    });
    return () => links.forEach((l) => l.remove());
  }, []);

  return (
    <div className="sc-ts">
      <div className="sc-ts-faces">
        {FACES.map((f) => (
          <div className="sc-ts-face" key={f.name}>
            <div
              className="sc-ts-sample"
              style={{ fontFamily: f.css, fontWeight: f.weight }}
            >
              Adya Kali
            </div>
            <div className="sc-ts-meta">
              <span className="sc-ts-name">{f.name}</span>
              <span className="sc-ts-role">{f.role}</span>
              <span className="sc-ts-note">{f.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sc-ts-treatments">
        <div className="sc-ts-card">
          <div className="sc-ts-tag">Outline + solid mix</div>
          <div className="sc-ts-outline">
            <span>HER</span> <span className="hollow">MANY</span> <span>FACES</span>
          </div>
        </div>

        <div className="sc-ts-card">
          <div className="sc-ts-tag">Kicker + headline</div>
          <div className="sc-ts-kicker">परिचय · About</div>
          <div className="sc-ts-headline">The Mother, gathered</div>
        </div>

        <div className="sc-ts-card">
          <div className="sc-ts-tag">Display + italic serif accent</div>
          <div className="sc-ts-mixed">
            She is the <em>silence</em> beneath every name
          </div>
        </div>

        <div className="sc-ts-card">
          <div className="sc-ts-tag">Oversized numeral + label</div>
          <div className="sc-ts-numeral">
            <span className="n">108</span>
            <span className="l">Names of the Mother</span>
          </div>
        </div>

        <div className="sc-ts-card">
          <div className="sc-ts-tag">Drop cap</div>
          <p className="sc-ts-dropcap">
            She who existed before time — the primordial darkness from which all
            light is born, and to which every light returns at the end of its
            burning.
          </p>
        </div>

        <div className="sc-ts-card">
          <div className="sc-ts-tag">Tracked caps label</div>
          <div className="sc-ts-tracked">Darshan · Katha · Seva · Sangha</div>
        </div>
      </div>
    </div>
  );
}
