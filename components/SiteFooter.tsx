"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";

/**
 * Fades, un-blurs, and scales up as the footer enters the viewport — the
 * "reveal" nod to motion.dev's footer-reveal example, scoped to an
 * entrance transition rather than its full sticky-curtain scroll-pin
 * (that trick needs every page's content wrapped in a shared positioning
 * context; this keeps the visual payoff without that page-wide rework).
 */
export default function SiteFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "start 0.6"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const blurPx = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

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
      <motion.div className="sfoot-inner" style={{ opacity, scale, filter }}>
        <div className="sfoot-grid">
          <div className="sfoot-brand-col">
            <div className="sfoot-deva">॥ जय माँ आद्या महाकाली ॥</div>
            <div className="sfoot-word">Adya Kali</div>
            <div className="sfoot-cols">
              <nav className="sfoot-nav">
                <a href="/">Home</a>
                <a href="/gallery">Gallery</a>
                <a href="/about">About</a>
                <a href="/blog">Katha</a>
              </nav>
              <nav className="sfoot-nav">
                <a
                  href="https://www.instagram.com/kaliputramission/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a href="/sitemap.xml">Sitemap</a>
              </nav>
            </div>
          </div>

          <div className="sfoot-news">
            <div className="sfoot-news-label">Newsletter</div>
            <p className="sfoot-news-copy">
              Darshan updates, new additions to the library, and the story of
              Adya Kali — straight to your inbox.
            </p>
            <form className="sfoot-form" onSubmit={handleSubmit}>
              <div className="sfoot-fields">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit">{sent ? "Subscribed" : "Subscribe"}</button>
            </form>
          </div>
        </div>

        <div className="sfoot-legal">
          © {new Date().getFullYear()} Maa Adya Kali Gallery · KaliPutra
          Mission. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}
