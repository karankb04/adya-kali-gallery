import localData from "@/data/images.json";
import { NavButtons } from "@/components/showcase2/NavTypeSpecimen";

const CAPTION = (localData as { teachingCaption?: string }[])[0]?.teachingCaption ?? "";

const SYSTEMS = [
  {
    key: "current",
    name: "Today",
    fonts: "Clash Display + Roboto Slab",
    cost: "113 KB, loaded today",
    feeling: "For comparison. The slab body reads like a textbook next to the sharp Clash headings, which is most of why it feels basic.",
  },
  {
    key: "grotesk",
    name: "Sanctum Grotesk",
    fonts: "Inter Tight + Instrument Serif + JetBrains Mono",
    cost: "136 KB",
    feeling: "Closest to Click to Keep: giant, tightly packed capitals with one word set in a soft serif italic. Bold and modern, like a gallery poster.",
  },
  {
    key: "bricolage",
    name: "Living Grotesque",
    fonts: "Bricolage Grotesque + JetBrains Mono",
    cost: "190 KB",
    feeling: "A grotesque with ink traps and quirks, condensed for the headline. Feels hand-made and alive rather than corporate.",
  },
  {
    key: "boska",
    name: "Devotional Serif",
    fonts: "Boska italic + Switzer + JetBrains Mono",
    cost: "206 KB",
    feeling: "A dramatic italic serif with sharp, flame-like strokes, over a calm Swiss body. The most reverent of the five.",
  },
  {
    key: "instrument",
    name: "Gallery Editorial",
    fonts: "Instrument Serif + Inter Tight + JetBrains Mono",
    cost: "136 KB",
    feeling: "A huge, elegant condensed serif, the way art books and luxury houses set their names. Quiet and expensive.",
  },
  {
    key: "clash",
    name: "Clash, minus the slab",
    fonts: "Clash Display + Satoshi + JetBrains Mono",
    cost: "163 KB",
    feeling: "The least change: keep the headings you know, swap the slab body for a clean geometric sans and add file-style labels.",
  },
];

/**
 * The same content set in six type systems, each a full mini-page (nav,
 * headline, Hindi line, label, body, caption) so they compare like for like.
 * Fonts come from app/components3/fonts.ts via CSS variables.
 */
export default function TypeSystems() {
  return (
    <div className="s3-types">
      {SYSTEMS.map((s) => (
        <div className="s3-type-row" key={s.key}>
          <div className={`s3-type s3-type-${s.key}`}>
            <div className="s3-type-nav">
              <span className="s3-type-mark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" />
                Maa Adya Kali Gallery
              </span>
              <span className="s3-type-links">
                <span>Gallery</span>
                <span>About</span>
                <span>Music</span>
                <span className="is-katha">Katha</span>
              </span>
              <NavButtons />
            </div>

            <p className="s3-type-hero">Maa Adya Kali</p>
            <p className="s3-type-deva" lang="hi">
              ॥ जय माँ आद्या काली ॥
            </p>

            <div className="s3-type-body">
              <span className="s3-type-label">[ Darshan ]</span>
              <div>
                <p className="s3-type-sub">
                  Every face of the <em>Mother</em>, whole.
                </p>
                <p className="s3-type-text">{CAPTION}</p>
              </div>
              <span className="s3-type-cap">MAHAKALI_01.JPG · 2026</span>
            </div>
          </div>

          <div className="s3-type-meta">
            <span className="s3-type-name">{s.name}</span>
            <span className="s3-type-fonts">
              {s.fonts} · {s.cost}
            </span>
            <span className="s3-type-feel">{s.feeling}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
