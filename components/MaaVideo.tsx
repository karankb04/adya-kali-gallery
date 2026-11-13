"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * The yellow "poster" moment: a short LTX clip of Maa whose camera push-in is
 * driven by scroll, with a giant green ADYA drawn BEHIND her.
 *
 * How "behind" works: the clip has a flat yellow background, so each frame we
 * build a small mask of where that yellow shows and only let the lettering
 * paint there. The word never touches her face, crown or jewellery.
 *
 * The section is pinned with GSAP (CSS sticky can't work here because body
 * has overflow-x:hidden). Scroll distance is 154% of the viewport.
 */
const LEAF = "#0E9F48";

export default function MaaVideo() {
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinEl = pinRef.current;
    const cv = canvasRef.current;
    const v = videoRef.current;
    if (!pinEl || !cv || !v) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const kind = window.matchMedia("(max-aspect-ratio: 1/1)").matches ? "phone" : "laptop";
    v.src = `/media/maa-${kind}.mp4`;
    const setPoster = (end: boolean) => {
      pinEl.style.backgroundImage = `url(/media/maa-${kind}-poster${end ? "-end" : ""}.webp)`;
    };
    // A still frame shows while the clip loads (no blank yellow). It must be
    // the SAME frame the video will open on, otherwise the picture jumps
    // (zooms) when the video takes over: reduced-motion visitors see the
    // final frame, everyone else the first.
    setPoster(reduced);

    // Phones (iOS especially) only fetch metadata for a paused video, so there
    // is no frame to draw. A muted play-then-pause makes them decode frames.
    const prime = () => {
      v.play().then(() => v.pause()).catch(() => {});
    };
    v.addEventListener("loadedmetadata", prime, { once: true });

    const cx = cv.getContext("2d");
    const tc = document.createElement("canvas");
    const tx = tc.getContext("2d");
    const mc = document.createElement("canvas");
    const mx = mc.getContext("2d", { willReadFrequently: true });
    if (!cx || !tx || !mx) return;

    // Canvas can't read CSS variables, so resolve next/font's real family name.
    const fam =
      getComputedStyle(document.documentElement).getPropertyValue("--font-anton").trim() || "Anton, Impact, sans-serif";
    document.fonts?.load(`100px ${fam}`);

    let W = 0, H = 0, target = reduced ? 1 : 0, shown = target, lastT = -1, raf = 0;
    // The canvas stays invisible until the video sits on the right frame,
    // then fades in over the matching still: no jump, no zoom.
    let ready = false;
    cv.style.opacity = "0";
    cv.style.transition = "opacity .6s ease";
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = tc.width = Math.round(r.width * d);
      H = cv.height = tc.height = Math.round(r.height * d);
    };
    fit();
    window.addEventListener("resize", fit);

    const cover = () => {
      const vr = v.videoWidth / v.videoHeight, cr = W / H;
      const w = cr > vr ? W : H * vr;
      const h = cr > vr ? W / vr : H;
      return [(W - w) / 2, (H - h) / 2, w, h] as const;
    };
    const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const buildMask = () => {
      const mw = 320, mh = Math.round((mw * v.videoHeight) / v.videoWidth);
      if (mc.width !== mw) { mc.width = mw; mc.height = mh; }
      mx.drawImage(v, 0, 0, mw, mh);
      const id = mx.getImageData(0, 0, mw, mh), p = id.data;
      for (let i = 0; i < p.length; i += 4) {
        // bright flat yellow (≈250,241,18) → 1; gold/skin/hair → 0
        const a = clamp((p[i + 1] - 175) / 40) * clamp((p[i] - 185) / 40) * clamp((130 - p[i + 2]) / 60);
        p[i] = p[i + 1] = p[i + 2] = 0;
        p[i + 3] = a * 255;
      }
      mx.putImageData(id, 0, 0);
    };

    const render = () => {
      if (v.duration && !v.seeking) {
        const t = target * (v.duration - 0.05);
        // Before it's shown, go straight to the right frame; afterwards ease (smooth scrubbing).
        if (Math.abs(v.currentTime - t) > 0.01) v.currentTime = ready ? v.currentTime + (t - v.currentTime) * 0.35 : t;
      }
      shown += (target - shown) * 0.12;
      // While the phone "wake up" playback runs, don't paint moving frames.
      if (!ready && v.readyState >= 2 && v.paused && v.duration &&
          Math.abs(v.currentTime - target * (v.duration - 0.05)) < 0.06) {
        ready = true;
        shown = target;
      }
      if (ready && v.readyState >= 2 && W) {
        const [x0, y0, w, h] = cover();
        if (v.currentTime !== lastT) { buildMask(); lastT = v.currentTime; }
        cx.clearRect(0, 0, W, H);
        cx.drawImage(v, x0, y0, w, h);
        tx.globalCompositeOperation = "source-over";
        tx.clearRect(0, 0, W, H);
        const mob = W < H;
        let fs = W * 0.33;
        if (mob) { tx.font = `100px ${fam}`; fs = (100 * (W * 0.96)) / tx.measureText("ADYA").width; }
        tx.font = `${fs}px ${fam}`;
        tx.fillStyle = LEAF;
        tx.textBaseline = "top";
        tx.save();
        tx.translate(-W * 0.01, H * (mob ? 0.06 : 0.02) + H * (0.06 - 0.12 * shown));
        tx.scale(0.95 + 0.1 * shown, 0.95 + 0.1 * shown);
        tx.fillText("ADYA", 0, 0);
        tx.restore();
        tx.globalCompositeOperation = "destination-in";
        tx.drawImage(mc, x0, y0, w, h);
        cx.drawImage(tc, 0, 0);
        if (cv.style.opacity !== "1") cv.style.opacity = "1";
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: "+=154%",
        pin: true,
        scrub: true,
        onUpdate: (s) => { target = reduced ? 1 : s.progress; },
      });
      // Page opened (or reloaded) already partway down: start from that frame.
      if (!reduced) {
        target = shown = st.progress;
        setPoster(st.progress > 0.5);
      }
      if (!reduced) {
        gsap.fromTo(outlineRef.current, { xPercent: 18 }, {
          xPercent: -18, ease: "none",
          scrollTrigger: { trigger: pinEl, start: "top top", end: "+=154%", scrub: true },
        });
        gsap.from(footRef.current, {
          y: 60, opacity: 0, ease: "none",
          scrollTrigger: { trigger: pinEl, start: "top top", end: "+=40%", scrub: true },
        });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      ctx.revert();
    };
  }, []);

  return (
    <section className="maa" aria-label="Maa Adya Kali — Mother of infinite forms">
      <div className="maa-stick" ref={pinRef}>
        <video ref={videoRef} muted playsInline preload="auto" style={{ display: "none" }} />
        <canvas ref={canvasRef} className="maa-canvas" aria-hidden="true" />
        <div className="maa-outline" ref={outlineRef} aria-hidden="true">Maa Adya</div>
        <div className="maa-v maa-v1">Crowned beyond time</div>
        <div className="maa-v maa-v2">The Mother • The Eternal</div>
        <div className="maa-shade" />
        <div className="maa-foot" ref={footRef}>
          <p className="maa-foot-s">From the cremation ground to the heart of creation — she is time, power and liberation.</p>
          <p className="maa-foot-t">Mother of infinite <em className="it">forms</em></p>
          <p className="maa-foot-d">Bhairavakaalike Namosthute</p>
        </div>
      </div>
    </section>
  );
}
