"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/music", label: "Music" },
  { href: "/blog", label: "Katha" },
];

/**
 * Phone / small-tablet menu. The desktop links are hidden under 900px, so
 * this round "menu" button opens a full-screen red panel with big links.
 * Closes on link tap, the close button, or Escape; the page doesn't scroll
 * behind it while open.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="pmenu-btn"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Rendered at the end of <body> so no header styling can shrink it */}
      {open && createPortal(
        <div className="pmenu" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="pmenu-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="pmenu-jai">॥ Jai Maa Adya ॥</div>
          <nav className="pmenu-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
          <a className="pmenu-mission" href="https://kaliputra.com" target="_blank" rel="noopener noreferrer">
            Visit KaliPutra Mission ↗
          </a>
        </div>,
        document.body
      )}
    </>
  );
}
