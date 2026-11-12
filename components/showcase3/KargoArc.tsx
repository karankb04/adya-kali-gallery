"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { KaliImage } from "@/types/image";
import { panelSize, arcTransform } from "@/lib/arc";
import RImage from "@/components/RImage";
import DarshanModal from "@/components/DarshanModal";

const GAP = 14;
const LABEL_SPACE = 44;

/**
 * A curved sanctum wall in the spirit of Kargo Studio's works page: a ribbon
 * of darshans on the inside of a cylinder. Scrolling (the section pins) or
 * dragging moves the ribbon; every panel keeps its image's own shape, so
 * nothing of Maa is ever cropped. Reduced motion gets a flat swipeable row.
 */
export default function KargoArc({ images }: { images: KaliImage[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [panelH, setPanelH] = useState(560);
  const [flat, setFlat] = useState(false);
  const [selected, setSelected] = useState<KaliImage | null>(null);

  const sizes = images.map((img) => panelSize(img, panelH));

  // Panel height follows the viewport: min(50vh, 520px), minus the label row.
  useEffect(() => {
    const fit = () => setPanelH(Math.round(Math.min(window.innerHeight * 0.5, 520) - LABEL_SPACE));
    fit();
    setFlat(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (flat) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    gsap.registerPlugin(ScrollTrigger);

    const vw = () => window.innerWidth;
    // Centre of each panel along the track; the track's side padding lets the
    // first and last panel reach the middle of the screen.
    const pad = () => vw() / 2 - (sizes[0]?.width ?? 0) / 2;
    const centres = () => {
      let x = pad();
      return sizes.map((s) => {
        const c = x + s.width / 2;
        x += s.width + GAP;
        return c;
      });
    };
    const maxX = () => {
      const c = centres();
      return Math.max(0, (c[c.length - 1] ?? 0) - vw() / 2);
    };

    let target = 0;
    let x = 0;
    let st: ScrollTrigger | undefined;
    const t = setTimeout(() => {
      track.style.paddingLeft = `${pad()}px`;
      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${maxX()}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => (target = self.progress * maxX()),
      });
      ScrollTrigger.refresh();
    }, 0);

    // Dragging moves the page scroll, so drag and wheel share one position
    // and the pin always releases at the end.
    let dragging = false;
    let lastX = 0;
    let velocity = 0;
    let moved = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      moved = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx;
      moved += Math.abs(dx);
      window.scrollBy(0, -dx);
    };
    const onUp = () => (dragging = false);
    // A drag that ends on a panel isn't a click on it.
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    section.addEventListener("click", onClick, true);
    section.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    let raf = 0;
    const frame = () => {
      if (!dragging && Math.abs(velocity) > 0.5) {
        velocity *= 0.92;
        window.scrollBy(0, -velocity);
      }
      x += (target - x) * 0.14;
      track.style.transform = `translate3d(${-x}px,0,0)`;
      const c = centres();
      const w = vw();
      const opts = { radiusVw: w < 700 ? 2.4 : 1.45 };
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const { rotateY, translateZ } = arcTransform(c[i] - x - w / 2, w, opts);
        el.style.transform = `translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Keyboard: bring the focused panel to the centre of the wall.
    const onFocus = (e: FocusEvent) => {
      const i = panelRefs.current.indexOf(e.target as HTMLButtonElement);
      if (i < 0 || !st) return;
      const want = Math.min(maxX(), Math.max(0, centres()[i] - vw() / 2));
      window.scrollTo({ top: st.start + want, behavior: "instant" as ScrollBehavior });
    };
    track.addEventListener("focusin", onFocus);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      st?.kill();
      section.removeEventListener("click", onClick, true);
      section.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      track.removeEventListener("focusin", onFocus);
      // Leave no 3D behind (e.g. when reduced motion switches to the flat row).
      track.style.transform = "";
      track.style.paddingLeft = "";
      panelRefs.current.forEach((el) => el && (el.style.transform = ""));
    };
    // sizes is derived from panelH and images; re-run when either changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat, panelH, images]);

  return (
    <div ref={sectionRef} className={`s3-arc${flat ? " s3-arc--flat" : ""}`}>
      <div ref={trackRef} className="s3-arc-track">
        {images.map((img, i) => (
          <button
            key={img.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="s3-arc-panel"
            style={{ width: sizes[i].width }}
            onClick={() => setSelected(img)}
            aria-label={`Open darshan: ${img.transliteration}, ${img.form}`}
          >
            <span className="s3-arc-media" style={{ height: sizes[i].height }}>
              <RImage
                r2Key={img.r2Key}
                alt={img.altText ?? `${img.transliteration} — ${img.form}`}
                fill
                sizes={`${Math.round(sizes[i].width)}px`}
                dominantColor={img.dominantColor}
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="s3-arc-label">
              <span>{img.form}</span>
              <span>{img.transliteration}</span>
            </span>
          </button>
        ))}
      </div>
      <DarshanModal image={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
