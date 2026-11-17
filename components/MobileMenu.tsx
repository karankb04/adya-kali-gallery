"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
/** True when `href` is the page being viewed (sub-pages of /blog count as Katha). */
export function isCurrent(pathname: string | null, href: string) {
  if (!pathname) return false;
  const path = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? path === "/" : path === href || path.startsWith(href + "/");
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    // Move keyboard focus into the menu, keep Tab inside it, and give it back to the button on close.
    panel?.querySelector<HTMLElement>(".pmenu-links a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>("a, button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const btn = btnRef.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={btnRef}
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
        <div className="pmenu" role="dialog" aria-modal="true" aria-label="Menu" ref={panelRef}>
          <button type="button" className="pmenu-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="pmenu-jai">॥ Jai Maa Adya ॥</div>
          <nav className="pmenu-links">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={isCurrent(pathname, l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
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
