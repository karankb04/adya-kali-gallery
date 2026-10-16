"use client";
import { useEffect, useRef } from "react";

const PHRASE = "Jai Maa Adya Kali";
const BASE_SPEED = 60; // px per second at rest
const SKEW_MAX = 8;

/**
 * A marquee that reacts to how you scroll: it speeds up with scroll velocity,
 * flips direction when you scroll back up, and skews slightly under
 * acceleration before settling.
 *
 * Driven by a single rAF loop that owns one `x` offset — no ScrollTrigger, no
 * layout reads per frame. Velocity is sampled from scrollY deltas and decays
 * toward zero, which is what produces the "settling" feel.
 */
export default function VelocityMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    let raf = 0;
    let half = track.scrollWidth / 2;

    const onScroll = () => {
      const now = window.scrollY;
      velocity += (now - lastScroll) * 0.9;
      lastScroll = now;
    };

    const measure = () => {
      half = track.scrollWidth / 2;
    };

    const loop = (time: number) => {
      const dt = Math.min(64, time - lastTime) / 1000;
      lastTime = time;

      // Direction follows scroll direction; magnitude adds to the base drift.
      const dir = velocity < 0 ? 1 : -1;
      const speed = BASE_SPEED + Math.min(2600, Math.abs(velocity) * 12);
      x += dir * speed * dt;

      // Wrap within one copy's width so the loop is seamless in both directions.
      if (half > 0) {
        if (x <= -half) x += half;
        if (x >= 0) x -= half;
      }

      const skew = Math.max(-SKEW_MAX, Math.min(SKEW_MAX, velocity * 0.35));
      track.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;

      velocity *= 0.9; // decay back to rest
      if (Math.abs(velocity) < 0.01) velocity = 0;
      raf = requestAnimationFrame(loop);
    };

    measure();
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // Two identical halves so the wrap point is invisible.
  const run = Array.from({ length: 6 });
  return (
    <div className="sc-vm">
      <div className="sc-vm-track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <div className="sc-vm-copy" key={copy} aria-hidden={copy === 1}>
            {run.map((_, i) => (
              <span className="sc-vm-item" key={i}>
                {PHRASE}
                <i className="sc-vm-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="sc-vm-hint">Scroll — the ribbon follows your speed and direction</div>
    </div>
  );
}
