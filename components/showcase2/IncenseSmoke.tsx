"use client";
import { useEffect, useRef } from "react";

type Puff = { x: number; y: number; r: number; vy: number; phase: number; life: number; max: number };

/**
 * Agarbatti smoke drifting up behind a heading. A few dozen soft circles
 * rise, sway and fade, drawn into one small canvas.
 *
 * Kept cheap on purpose: the canvas is capped at 1.5x device pixels, the
 * loop stops whenever the section is off screen, and under reduced motion
 * nothing is drawn at all.
 */
export default function IncenseSmoke() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, visible = false, last = performance.now(), spawnClock = 0;
    const SPAWN_EVERY = 0.16; // seconds — time-based, so density is the same at any frame rate
    const puffs: Puff[] = [];

    const size = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (): Puff => ({
      x: w / 2 + (Math.random() - 0.5) * 14,
      y: h + 10,
      r: 10 + Math.random() * 14,
      vy: 36 + Math.random() * 26,
      phase: Math.random() * Math.PI * 2,
      life: 0,
      max: 5 + Math.random() * 3,
    });

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      spawnClock += dt;
      while (spawnClock >= SPAWN_EVERY) {
        spawnClock -= SPAWN_EVERY;
        if (puffs.length < 60) puffs.push(spawn());
      }
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        p.y -= p.vy * dt;
        p.r += 9 * dt;
        const k = p.life / p.max;
        const x = p.x + Math.sin(p.phase + p.life * 1.3) * (12 + k * 60);
        const a = Math.max(0, Math.sin(Math.min(1, k) * Math.PI)) * 0.16;
        if (k >= 1) { puffs.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r);
        g.addColorStop(0, `rgba(236,224,212,${a})`);
        g.addColorStop(1, "rgba(236,224,212,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(loop);
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(wrap);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="s2-smoke" ref={wrapRef}>
      <canvas ref={canvasRef} className="s2-smoke-canvas" aria-hidden="true" />
      <div className="s2-smoke-text">
        <span className="s2-smoke-deva">धूप</span>
        <h3>Offer her your attention</h3>
        <p>The smoke rises the way prayer does: slowly, without hurry.</p>
      </div>
      <span className="s2-smoke-stick" aria-hidden="true" />
    </div>
  );
}
