"use client";
import { useEffect } from "react";

const LINKS = [
  { en: "Gallery", hi: "दर्शन" },
  { en: "About", hi: "परिचय" },
  { en: "Music", hi: "संगीत" },
  { en: "Katha", hi: "कथा" },
];

const OPTIONS = [
  {
    key: "current",
    name: "Current",
    fonts: "Clash Display + Roboto Slab",
    cost: "Already loaded",
    note: "The slab links sit a little heavy and bookish next to the sharp Clash wordmark and buttons; the two voices don't quite agree.",
  },
  {
    key: "caps",
    name: "A · Spaced capitals",
    fonts: "Clash Display only",
    cost: "0 KB, nothing new",
    note: "Links in the same face as the buttons, small and widely spaced. A red bindu appears under the link you hover. The whole bar finally speaks one voice.",
  },
  {
    key: "cinzel",
    name: "B · Temple inscription",
    fonts: "Cinzel + Josefin Sans",
    cost: "2 small font files",
    note: "Cinzel is drawn from carved Roman stone capitals, so the name reads like an inscription over a temple gate. Light geometric links keep it modern; a gold hairline grows on hover.",
  },
  {
    key: "cormorant",
    name: "C · Scripture",
    fonts: "Cormorant Garamond",
    cost: "1–2 font files",
    note: "A refined book serif with tall, calligraphic italics. The softest, most devotional option, like the title page of an old prayer book.",
  },
  {
    key: "bodoni",
    name: "D · Editorial",
    fonts: "Bodoni Moda + Jost",
    cost: "2 font files",
    note: "High-contrast italic wordmark with small numbered links, the way a fine-art magazine sets its masthead. Feels like a curated gallery, not a website.",
  },
  {
    key: "marcellus",
    name: "E · Lapidary",
    fonts: "Marcellus SC",
    cost: "1 font file, one weight",
    note: "Classical small capitals with gentle flared strokes, separated by tiny gold diamonds. Calm and ceremonial; the lightest of the new fonts.",
  },
  {
    key: "bilingual",
    name: "F · Bilingual",
    fonts: "Clash Display + Tiro Devanagari",
    cost: "0 KB, both already loaded",
    note: "Each link carries its Hindi name above the English one, and the wordmark gains आद्या काली. Says at a glance whose home this is.",
  },
];

/**
 * Six typographic directions for the header's wordmark and links, each shown
 * in a full replica of the bar with the real Donate and Mission buttons left
 * exactly as they are.
 *
 * Candidate fonts load with Google Fonts' `text=` parameter, so this page only
 * downloads the handful of letters the nav actually uses.
 */
export default function NavTypeSpecimen() {
  useEffect(() => {
    const families = [
      "Cinzel:wght@700",
      "Josefin+Sans:wght@500",
      "Cormorant+Garamond:ital,wght@0,700;1,600",
      "Bodoni+Moda:ital,wght@1,700",
      "Jost:wght@500",
      "Marcellus+SC",
    ]
      .map((f) => `family=${f}`)
      .join("&");
    const text = "Maa Adya Kali Gallery About Music Katha 01234 ◆·";
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = `https://fonts.googleapis.com/css2?${families}&text=${encodeURIComponent(
      text + text.toUpperCase()
    )}&display=swap`;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  return (
    <div className="s2-nav">
      {OPTIONS.map((o) => (
        <div className="s2-nav-row" key={o.key}>
          <div className={`s2-nav-bar s2-nav-${o.key}`}>
            <a href="#" className="s2-nav-mark" onClick={(e) => e.preventDefault()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" />
              <span className="s2-nav-name">
                {o.key === "bilingual" && (
                  <span className="s2-nav-name-hi" lang="hi">
                    आद्या काली
                  </span>
                )}
                Maa Adya Kali Gallery
              </span>
            </a>

            <nav className="s2-nav-links" aria-label={`${o.name} nav preview`}>
              {LINKS.map((l, i) => (
                <a
                  key={l.en}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={l.en === "Katha" ? "is-katha" : undefined}
                >
                  {o.key === "bodoni" && <sup>0{i + 1}</sup>}
                  {o.key === "bilingual" && (
                    <span className="s2-nav-hi" lang="hi">
                      {l.hi}
                    </span>
                  )}
                  <span className="s2-nav-en">{l.en}</span>
                </a>
              ))}
            </nav>

            <NavButtons />
          </div>

          <div className="s2-nav-meta">
            <span className="s2-nav-title">{o.name}</span>
            <span className="s2-nav-fonts">
              {o.fonts} · {o.cost}
            </span>
            <span className="s2-nav-note">{o.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** The live header's two buttons, unchanged. */
function NavButtons() {
  return (
    <div className="nav-cta">
      <a href="/about#seva" className="btn-donate">
        <span className="btn-donate-decor" />
        <span className="btn-donate-content">
          <span className="btn-donate-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="btn-donate-text">Donate</span>
        </span>
      </a>
      <a href="https://kaliputra.com" target="_blank" rel="noopener noreferrer" className="btn-mission">
        <span className="btn-mission-fill" />
        <span className="btn-mission-text">Visit KaliPutra Mission</span>
        <span className="btn-mission-arrow" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="13">
            <path
              d="M4 12L12 4M12 4H5.5M12 4V10.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}
