"use client";
import { useEffect, useState } from "react";

interface SiteHeaderProps {
  /**
   * "hero"  — transparent over the dark hero, turns solid on scroll (home).
   * "page"  — always solid (blog, gallery, about, and other inner pages).
   */
  variant?: "hero" | "page";
}

export default function SiteHeader({ variant = "hero" }: SiteHeaderProps) {
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
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/blog" className="nav-katha">
          Katha
        </a>
      </nav>
      <div style={{ width: 19 }} />
    </header>
  );
}
