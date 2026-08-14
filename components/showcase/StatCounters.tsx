"use client";
import { useEffect, useRef } from "react";
import { STATS } from "./sampleData";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const decimals = String(value).includes(".") ? String(value).split(".")[1].length : 0;
    const duration = 1800;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.unobserve(el);
        const start = performance.now();
        function frame(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = easeOutCubic(t);
          el!.textContent = (value * eased).toFixed(decimals);
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span className="sc-counter-num">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export default function StatCounters() {
  return (
    <div className="sc-counters">
      {STATS.map((s) => (
        <div key={s.label} className="sc-counter">
          <Counter value={s.value} suffix={s.suffix} />
          <span className="sc-counter-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
