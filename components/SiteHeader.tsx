"use client";
import { useEffect, useState } from "react";

interface SiteHeaderProps {
  /**
   * "hero"  — transparent over the dark hero, turns solid on scroll (home).
   * "page"  — always solid (blog and other inner pages).
   */
  variant?: "hero" | "page";
  /** Home only: called when a form nav link is clicked (sets the filter). */
  onNavForm?: (form: string) => void;
  /** Home only: smooth-scrolls to the library instead of navigating. */
  onNavLibrary?: () => void;
}

// Nav shortcuts map evocative labels to actual form values present in the data.
export const NAV_FORMS: { label: string; form: string }[] = [
  { label: "Smashan", form: "Shmashana Kali" },
  { label: "Dakshina", form: "Dakshina Kali" },
];

export default function SiteHeader({
  variant = "hero",
  onNavForm,
  onNavLibrary,
}: SiteHeaderProps) {
  const [solid, setSolid] = useState(variant === "page");

  useEffect(() => {
    if (variant === "page") return;
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <header className={`bar${solid ? " solid" : ""}${variant === "page" ? " page" : ""}`} id="bar">
      <a href="/" className="mark" style={{ textDecoration: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Maa Adya Kali Gallery logo" />
        Maa Adya Kali Gallery
      </a>
      <nav className="navlinks">
        <a
          href="/#library"
          onClick={
            onNavLibrary
              ? (e) => {
                  e.preventDefault();
                  onNavLibrary();
                }
              : undefined
          }
        >
          The Library
        </a>
        {NAV_FORMS.map((n) => (
          <a
            key={n.label}
            href={`/?form=${encodeURIComponent(n.form)}#library`}
            onClick={
              onNavForm
                ? (e) => {
                    e.preventDefault();
                    onNavForm(n.form);
                  }
                : undefined
            }
          >
            {n.label}
          </a>
        ))}
        <a href="/blog" className="nav-katha">
          Katha
        </a>
      </nav>
      <div style={{ width: 19 }} />
    </header>
  );
}
