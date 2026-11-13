"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Site-wide footer (redesign): a sindoor-red band with the newsletter and
 * links on top, and a giant "ADYA Kali" wordmark that rises into place as
 * the footer scrolls in.
 */
export default function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const wordY = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
  }

  return (
    <footer className="sfoot" ref={footerRef}>
      <div className="sfoot-inner">
        <div className="sfoot-top">
          <div className="sfoot-news">
            <div className="sfoot-jai">॥ Jai Maa Adya Mahakali ॥</div>
            <div className="sfoot-label">Newsletter</div>
            <p className="sfoot-news-copy">
              Darshan updates, new additions to the library, and the story of
              Adya Kali — straight to your inbox.
            </p>
            <form className="sfoot-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your name"
                aria-label="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your email"
                aria-label="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                {sent ? "Subscribed" : "Subscribe"}
                <span className="sfoot-ar" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          <nav className="sfoot-col" aria-label="Explore">
            <div className="sfoot-label">Explore</div>
            <Link href="/">Home</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Katha</Link>
          </nav>

          <nav className="sfoot-col" aria-label="Follow">
            <div className="sfoot-label">Follow</div>
            <a href="https://www.instagram.com/kaliputramission/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="/sitemap.xml">Sitemap</a>
          </nav>
        </div>

        <div className="sfoot-word-wrap" aria-hidden="true">
          <motion.div className="sfoot-word" style={{ y: wordY }}>
            Adya <em>Kali</em>
          </motion.div>
        </div>

        <div className="sfoot-legal">
          <span>© {new Date().getFullYear()} Maa Adya Kali Gallery · KaliPutra Mission</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
