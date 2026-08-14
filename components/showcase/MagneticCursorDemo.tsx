"use client";
import { useEffect, useRef } from "react";

/**
 * Magnetic pull + a custom label cursor, both lerping toward the pointer at
 * a fixed ratio (0.15) rather than snapping — that's what gives the soft
 * trailing feel. Scoped to this demo zone only (via mouseenter/leave on the
 * container) rather than page-wide, so it doesn't fight the rest of the
 * site's real cursor.
 *
 * Gotcha: the magnetic wrapper must never set `display` — doing so can
 * override a centred child's own layout (e.g. a circular button's
 * `display:grid` centring) and throw its label off-centre.
 */
export default function MagneticCursorDemo() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const magnetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const zone = zoneRef.current;
    const cursor = cursorRef.current;
    if (!zone || !cursor) return;

    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0;
    let raf = 0;
    const ratio = 0.15;

    function onMove(e: MouseEvent) {
      const rect = zone!.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;

      magnetRefs.current.forEach((el) => {
        if (!el) return;
        const strength = Number(el.dataset.magnetic || 25);
        const r = el.getBoundingClientRect();
        const cxEl = r.left + r.width / 2 - rect.left;
        const cyEl = r.top + r.height / 2 - rect.top;
        const dx = mx - cxEl;
        const dy = my - cyEl;
        const dist = Math.hypot(dx, dy);
        const radius = r.width * 1.6;
        if (dist < radius) {
          const pull = (1 - dist / radius) * strength;
          const angle = Math.atan2(dy, dx);
          el.style.transform = `translate(${Math.cos(angle) * pull}px, ${Math.sin(angle) * pull}px)`;
        } else {
          el.style.transform = "translate(0, 0)";
        }
      });
    }

    function tick() {
      cx += (mx - cx) * ratio;
      cy += (my - cy) * ratio;
      if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }

    function onEnter() {
      cursor!.classList.add("is-visible");
    }
    function onLeave() {
      cursor!.classList.remove("is-visible");
      magnetRefs.current.forEach((el) => el && (el.style.transform = "translate(0, 0)"));
    }
    function onOverLabel(e: Event) {
      const label = (e.currentTarget as HTMLElement).dataset.cursorLabel;
      cursor!.textContent = label ?? "";
      cursor!.classList.toggle("is-label", !!label);
    }
    function onOutLabel() {
      cursor!.textContent = "";
      cursor!.classList.remove("is-label");
    }

    zone.addEventListener("mousemove", onMove);
    zone.addEventListener("mouseenter", onEnter);
    zone.addEventListener("mouseleave", onLeave);
    const labeled = zone.querySelectorAll<HTMLElement>("[data-cursor-label]");
    labeled.forEach((el) => {
      el.addEventListener("mouseenter", onOverLabel);
      el.addEventListener("mouseleave", onOutLabel);
    });

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      zone.removeEventListener("mousemove", onMove);
      zone.removeEventListener("mouseenter", onEnter);
      zone.removeEventListener("mouseleave", onLeave);
      labeled.forEach((el) => {
        el.removeEventListener("mouseenter", onOverLabel);
        el.removeEventListener("mouseleave", onOutLabel);
      });
    };
  }, []);

  return (
    <div className="sc-magzone" ref={zoneRef}>
      <div className="sc-magcursor" ref={cursorRef} aria-hidden="true" />
      <div className="sc-mag-row">
        <div
          className="sc-magnetic-wrap"
          ref={(el) => {
            magnetRefs.current[0] = el;
          }}
          data-magnetic="28"
        >
          <button className="sc-btn-circle">Darshan</button>
        </div>
        <div
          className="sc-magnetic-wrap"
          ref={(el) => {
            magnetRefs.current[1] = el;
          }}
          data-magnetic="22"
        >
          <button className="sc-btn-circle sc-btn-circle--outline">Katha</button>
        </div>
        <a href="#" className="sc-mag-link" data-cursor-label="View" onClick={(e) => e.preventDefault()}>
          Hover for a label cursor
        </a>
      </div>
    </div>
  );
}
