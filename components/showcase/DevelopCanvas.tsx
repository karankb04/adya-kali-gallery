"use client";
import { useEffect, useRef } from "react";
import { r2url } from "@/lib/r2";
import { SAMPLE_IMAGES } from "./sampleData";

/**
 * Cursor-reactive "developing photo" effect: a blocky pixelated base layer
 * with a sharp detail layer masked into a soft radius around the pointer.
 *
 * 1. The real portrait is drawn once to an offscreen canvas at full detail.
 * 2. Every frame, a blocky base is drawn by downscaling that into a tiny
 *    canvas (one pixel per block) and re-drawing it upscaled with
 *    imageSmoothingEnabled = false — the cheap trick for crisp square
 *    blocks without a manual per-pixel loop.
 * 3. A sharp layer is masked with globalCompositeOperation = "destination-in"
 *    against a radial gradient centred on the lerped cursor position, so
 *    only the sharp pixels inside a soft-edged circle survive — that's what
 *    makes the developed zone fade into the blocky surroundings instead of
 *    a hard edge.
 * 4. The mask centre lerps toward the pointer at 0.12/frame and drifts in a
 *    slow idle circle if the pointer hasn't moved in 1.8s.
 *
 * No pixel read-back (no getImageData/toDataURL) is used, so the source
 * image doesn't need CORS headers to draw correctly here.
 */
export default function DevelopCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portrait = SAMPLE_IMAGES[13] ?? SAMPLE_IMAGES[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const img = new Image();
    let W = 0,
      H = 0;
    let raf = 0;
    let destroyed = false;

    let mx = 0,
      my = 0,
      px = 0,
      py = 0,
      lastMove = performance.now();

    const full = document.createElement("canvas");
    const fullCtx = full.getContext("2d")!;
    const block = document.createElement("canvas");
    const blockCtx = block.getContext("2d")!;
    const sharp = document.createElement("canvas");
    const sharpCtx = sharp.getContext("2d")!;

    function resize() {
      const wrap = canvas!.parentElement;
      if (!wrap) return;
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      full.width = W;
      full.height = H;
      sharp.width = W;
      sharp.height = H;
      drawFull();
    }

    function drawFull() {
      if (!img.complete || !img.naturalWidth) return;
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      fullCtx.clearRect(0, 0, W, H);
      fullCtx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    }

    function frame(now: number) {
      if (destroyed) return;
      const idle = now - lastMove > 1800;
      if (idle && !reduced) {
        const t = now / 1400;
        mx = W / 2 + Math.cos(t) * W * 0.22;
        my = H / 2 + Math.sin(t * 0.8) * H * 0.18;
      }
      px += (mx - px) * 0.12;
      py += (my - py) * 0.12;

      // blocky base
      const blockSize = 26;
      const cols = Math.max(1, Math.round(W / blockSize));
      const rows = Math.max(1, Math.round(H / blockSize));
      block.width = cols;
      block.height = rows;
      blockCtx.imageSmoothingEnabled = true;
      blockCtx.drawImage(full, 0, 0, W, H, 0, 0, cols, rows);
      ctx!.imageSmoothingEnabled = false;
      ctx!.clearRect(0, 0, W, H);
      ctx!.drawImage(block, 0, 0, cols, rows, 0, 0, W, H);
      ctx!.imageSmoothingEnabled = true;

      // sharp layer masked to a soft radius around the (lerped) cursor
      sharpCtx.clearRect(0, 0, W, H);
      sharpCtx.drawImage(full, 0, 0);
      sharpCtx.globalCompositeOperation = "destination-in";
      const radius = Math.min(W, H) * 0.28;
      const grad = sharpCtx.createRadialGradient(px, py, 0, px, py, radius);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.72, "rgba(0,0,0,0.9)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      sharpCtx.fillStyle = grad;
      sharpCtx.fillRect(0, 0, W, H);
      sharpCtx.globalCompositeOperation = "source-over";
      ctx!.drawImage(sharp, 0, 0);

      // halftone dot grid on top
      ctx!.fillStyle = "rgba(21,10,6,0.14)";
      const dot = 5;
      for (let y = dot / 2; y < H; y += dot) {
        for (let x = dot / 2; x < W; x += dot) {
          ctx!.beginPath();
          ctx!.arc(x, y, 0.6, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      lastMove = performance.now();
    }

    img.onload = () => {
      resize();
      px = mx = W / 2;
      py = my = H / 2;
      // Paint the first frame synchronously so there's no blank flash while
      // waiting on the next animation frame — frame() self-schedules the
      // next tick internally (guarded by `reduced`), so this single call
      // covers both the static and animated cases.
      frame(performance.now());
    };
    img.onerror = () => {
      // Leave the halftone-only base drawn by resize(); nothing more to do.
    };
    img.src = r2url(portrait.r2Key);

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    canvas.addEventListener("mousemove", onMove);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sc-develop">
      <canvas ref={canvasRef} />
      <span className="sc-develop-hint">Move your cursor across her</span>
    </div>
  );
}
