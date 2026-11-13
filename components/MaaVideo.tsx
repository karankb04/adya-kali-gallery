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
const YELLOW = "#FAF112";

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
      // match the canvas: tall screens show the clip full-width, sitting on the bottom
      const tall = pinEl.clientWidth / pinEl.clientHeight < (kind === "phone" ? 1152 / 1536 : 1920 / 1088);
      pinEl.style.backgroundSize = tall ? "100% auto" : "cover";
      pinEl.style.backgroundPosition = tall ? "center bottom" : "center";
    };
    // Very first paint (before even the small stills arrive): the start or
    // end frame, whichever the visitor will see first.
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

    let W = 0, H = 0, target = reduced ? 1 : 0, shown = target, lastKey = "", raf = 0;

    // 12 small still frames spread evenly across the clip (~0.5 MB in total,
    // they arrive long before the ~3.5 MB video). Until the video is ready
    // the canvas shows whichever still matches the scroll position, so the
    // zoom follows the visitor from the first second and nothing jumps when
    // the video takes over.
    const FRAMES = 12, CLIP = 4; // frames cover 0s … 4s of the clip
    const frames = Array.from({ length: FRAMES }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = `/media/frames/${kind}-${String(i + 1).padStart(2, "0")}.webp`;
      return img;
    });
    const frameFor = (t: number) => {
      const want = Math.max(0, Math.min(FRAMES - 1, Math.round((t / CLIP) * (FRAMES - 1))));
      // nearest still that has finished loading
      for (let d = 0; d < FRAMES; d++) {
        for (const i of [want - d, want + d]) {
          const f = frames[i];
          if (f && f.complete && f.naturalWidth) return [f, i] as const;
        }
      }
      return null;
    };

    // The video only takes over once it sits on the right frame (and isn't
    // in the phone "wake up" playback), so the hand-over is seamless.
    let ready = false;
    cv.style.transition = "opacity .35s ease";
    cv.style.opacity = "0";
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = tc.width = Math.round(r.width * d);
      H = cv.height = tc.height = Math.round(r.height * d);
    };
    fit();
    window.addEventListener("resize", fit);

    // Wide screens: fill the section (cover). Tall phone screens: fit the clip
    // to the screen WIDTH and sit it on the bottom, so nothing of Maa is ever
    // cut at the sides; the clip's flat yellow background simply continues
    // above her (that's where the big ADYA lives on phones).
    const place = (sw: number, sh: number) => {
      const vr = sw / sh, cr = W / H;
      if (cr < vr) {
        const h = W / vr;
        return [0, H - h, W, h, true] as const;
      }
      const w = cr > vr ? W : H * vr;
      const h = cr > vr ? W / vr : H;
      return [(W - w) / 2, (H - h) / 2, w, h, false] as const;
    };
    // full-screen version of the "where is the yellow background" mask
    const fm = document.createElement("canvas");
    const fx = fm.getContext("2d");
    const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const buildMask = (src: CanvasImageSource, sw: number, sh: number) => {
      const mw = 320, mh = Math.round((mw * sh) / sw);
      if (mc.width !== mw || mc.height !== mh) { mc.width = mw; mc.height = mh; }
      mx.drawImage(src, 0, 0, mw, mh);
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
      const dur = v.duration || 4.04;
      const want = target * (dur - 0.05);
      if (v.duration && !v.seeking) {
        // Before it's shown, go straight to the right frame; afterwards ease (smooth scrubbing).
        if (Math.abs(v.currentTime - want) > 0.01) v.currentTime = ready ? v.currentTime + (want - v.currentTime) * 0.35 : want;
      }
      shown += (target - shown) * 0.12;
      if (!ready && v.readyState >= 2 && v.paused && v.duration && Math.abs(v.currentTime - want) < 0.06) ready = true;

      // pick what to draw: the video once ready, otherwise the matching still
      let src: CanvasImageSource | null = null, sw = 0, sh = 0, key = "";
      if (ready && v.readyState >= 2) {
        src = v; sw = v.videoWidth; sh = v.videoHeight; key = "v" + v.currentTime;
      } else {
        const hit = frameFor(want);
        if (hit) { src = hit[0]; sw = hit[0].naturalWidth; sh = hit[0].naturalHeight; key = "f" + hit[1]; }
      }

      if (src && W) {
        const [x0, y0, w, h, fitted] = place(sw, sh);
        if (key !== lastKey) { buildMask(src, sw, sh); lastKey = key; }
        cx.clearRect(0, 0, W, H);
        cx.drawImage(src, x0, y0, w, h);
        if (fitted && y0 > 0) {
          // yellow above the clip, with a soft fade so its top edge never shows
          const fade = h * 0.16;
          cx.fillStyle = YELLOW;
          cx.fillRect(0, 0, W, y0 + 1);
          const g = cx.createLinearGradient(0, y0, 0, y0 + fade);
          g.addColorStop(0, YELLOW);
          g.addColorStop(1, "rgba(250,241,18,0)");
          cx.fillStyle = g;
          cx.fillRect(0, y0, W, fade);
        }
        tx.globalCompositeOperation = "source-over";
        tx.clearRect(0, 0, W, H);
        const mob = W < H;
        let fs = W * 0.33;
        if (mob) { tx.font = `100px ${fam}`; fs = (100 * (W * 0.96)) / tx.measureText("ADYA").width; }
        tx.font = `${fs}px ${fam}`;
        tx.fillStyle = LEAF;
        tx.textBaseline = "top";
        tx.save();
        // phones: drift less, so the word never slides up under the top bar
        tx.translate(-W * 0.01, mob ? H * (0.15 - 0.03 * shown) : H * (0.08 - 0.12 * shown));
        tx.scale(0.95 + 0.1 * shown, 0.95 + 0.1 * shown);
        tx.fillText("ADYA", 0, 0);
        tx.restore();
        tx.globalCompositeOperation = "destination-in";
        if (fitted && fx) {
          // everything outside the clip is plain yellow, so the word may show there
          if (fm.width !== W || fm.height !== H) { fm.width = W; fm.height = H; }
          fx.clearRect(0, 0, W, H);
          fx.fillStyle = "#000";
          fx.fillRect(0, 0, W, y0 + 1);
          fx.drawImage(mc, x0, y0, w, h);
          tx.drawImage(fm, 0, 0);
        } else {
          tx.drawImage(mc, x0, y0, w, h);
        }
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
