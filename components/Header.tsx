"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-60 flex items-center justify-between px-[clamp(1rem,4vw,2.4rem)] py-[0.9rem] transition-all duration-300 ${
        solid
          ? "bg-gradient-to-b from-[rgba(243,238,235,0.95)] to-transparent backdrop-blur-sm"
          : ""
      }`}
      style={{ zIndex: 60 }}
    >
      <div
        className={`flex items-center gap-2 font-display font-extrabold tracking-tight text-[1.05rem] transition-colors duration-300 ${
          solid ? "text-ink" : "text-cream"
        }`}
      >
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
          <circle cx="9.5" cy="9.5" r="9" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          <circle cx="9.5" cy="9.5" r="3" fill="currentColor" className="text-red" />
        </svg>
        Adya Kali
        <span className="text-red">.</span>
      </div>
      <nav
        className={`hidden md:flex gap-6 text-[0.78rem] font-medium tracking-wide transition-colors duration-300 ${
          solid ? "text-ink-soft" : "text-[rgba(251,242,228,0.85)]"
        }`}
      >
        {["Gallery", "Forms", "About"].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="hover:text-rose transition-colors duration-200"
          >
            {link}
          </a>
        ))}
      </nav>
    </header>
  );
}
