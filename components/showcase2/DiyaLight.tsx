"use client";
import { useEffect, useRef } from "react";
import RImage from "../RImage";
import { sample } from "../showcase/sampleData";

/**
 * A dark sanctum lit by a single diya: the image sits under near-black, and a
 * warm pool of light follows the pointer, as if you are holding a lamp up to
 * her. On touch devices (no hover) the light drifts on its own.
 *
 * The light is one radial-gradient on an overlay driven by two CSS variables,
 * lerped in a rAF loop that only runs while the section is on screen.
 */
export default function DiyaLight() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [img] = sample(1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;

    let tx = 0.5, ty = 0.42, x = tx, y = ty;
    let raf = 0;
    let visible = false;
    let t0 = performance.now();

    const set = () => {
      root.style.setProperty("--lx", `${x * 100}%`);
      root.style.setProperty("--ly", `${y * 100}%`);
    };
    set();
    if (reduce) return; // static, centred light

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
    };

    const loop = (now: number) => {
      if (!canHover) {
        // slow figure-eight drift, like a lamp being waved in aarti
        const t = (now - t0) / 1000;
        tx = 0.5 + Math.sin(t * 0.55) * 0.28;
        ty = 0.45 + Math.sin(t * 1.1) * 0.14;
      }
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      set();
      if (visible) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        t0 = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(root);
    if (canHover) root.addEventListener("pointermove", onMove);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="s2-diya" ref={rootRef}>
      <RImage
        r2Key={img.r2Key}
        alt={`${img.transliteration} — ${img.form}`}
        width={img.width}
        height={img.height}
        dominantColor={img.dominantColor}
        sizes="(max-width:760px) 92vw, 640px"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div className="s2-diya-dark" aria-hidden="true" />
      <div className="s2-diya-warm" aria-hidden="true" />
      <p className="s2-diya-hint">Move your lamp toward her</p>
    </div>
  );
}
