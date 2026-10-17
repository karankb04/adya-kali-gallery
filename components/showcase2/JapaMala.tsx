"use client";
import { useEffect, useReducer } from "react";

const BEADS = 108;
const R = 132; // ring radius in the 320x320 viewBox

/**
 * A japa mala of 108 beads. Each tap, click, or Space/Enter press moves one
 * bead, the way a devotee's thumb moves along a real mala; the 108th bead
 * completes the round. It's an invitation to stay and do something rather
 * than only look.
 *
 * The ring is a single SVG, so it's crisp at any size, and the whole thing
 * is a native <button>, which gives keyboard and screen-reader support for
 * free. No libraries; under 2 KB.
 */
type Mala = { count: number; rounds: number };

// Pure step, so rapid taps or a held Space key each advance from the latest
// count instead of a stale one.
function step({ count, rounds }: Mala): Mala {
  if (count === BEADS) return { count: 1, rounds };
  const next = count + 1;
  return { count: next, rounds: next === BEADS ? rounds + 1 : rounds };
}

export default function JapaMala() {
  const [{ count, rounds }, advance] = useReducer(step, { count: 0, rounds: 0 });
  const done = count === BEADS;

  useEffect(() => {
    if (done && "vibrate" in navigator) navigator.vibrate?.(40);
  }, [done]);

  return (
    <div className={`s2-mala${done ? " is-done" : ""}`}>
      <button
        className="s2-mala-btn"
        onClick={() => advance()}
        aria-label={done ? "Round complete. Begin another round" : `Bead ${count} of 108. Move to the next bead`}
      >
        <svg viewBox="0 0 320 320" className="s2-mala-svg" aria-hidden="true">
          <circle cx="160" cy="160" r={R} className="s2-mala-thread" />
          {Array.from({ length: BEADS }).map((_, i) => {
            const a = (i / BEADS) * Math.PI * 2 - Math.PI / 2;
            const cls = i < count ? "s2-bead on" : "s2-bead";
            return (
              <circle
                key={i}
                // Rounded: server and browser Math.sin can differ in the last
                // digit, which React reports as a hydration mismatch.
                cx={Math.round((160 + Math.cos(a) * R) * 100) / 100}
                cy={Math.round((160 + Math.sin(a) * R) * 100) / 100}
                r={i === count - 1 ? 6 : 4.2}
                className={i === count - 1 ? `${cls} cur` : cls}
              />
            );
          })}
          <circle cx="160" cy={160 - R - 14} r="7" className="s2-meru" />
        </svg>
        <span className="s2-mala-center">
          <span className="s2-mala-count">{count}</span>
          <span className="s2-mala-of">of 108</span>
          <span className="s2-mala-done">॥ जय माँ ॥</span>
        </span>
      </button>
      <p className="s2-mala-note" aria-live="polite">
        {done
          ? `Round ${rounds} complete. Tap to begin again.`
          : count === 0
            ? "Tap the mala (or press Space) for each name you chant."
            : rounds > 0
              ? `Round ${rounds + 1} in progress`
              : "Keep going. Each bead is one remembrance."}
      </p>
    </div>
  );
}
