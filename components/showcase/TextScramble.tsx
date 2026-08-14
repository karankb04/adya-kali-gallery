"use client";
import { useEffect, useRef } from "react";

const CHARS = "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह";

function ScrambleWord({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function run() {
      if (!el) return;
      let frame = 0;
      const totalFrames = text.length * 3;
      cancelAnimationFrame(raf.current);

      function step() {
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const lockFrame = i * 3;
          if (frame >= lockFrame + 6) out += text[i];
          else if (text[i] === " ") out += " ";
          else out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        el!.textContent = out;
        frame++;
        if (frame < totalFrames + 6) raf.current = requestAnimationFrame(step);
        else el!.textContent = text;
      }
      step();
    }

    el.addEventListener("mouseenter", run);
    return () => {
      el.removeEventListener("mouseenter", run);
      cancelAnimationFrame(raf.current);
    };
  }, [text]);

  return (
    <span className="sc-scramble" ref={ref}>
      {text}
    </span>
  );
}

const NAMES = ["Dakshina Kali", "Shmashana Kali", "Bhadra Kali", "Maha Kali"];

export default function TextScramble() {
  return (
    <div className="sc-scramble-list">
      {NAMES.map((n) => (
        <ScrambleWord key={n} text={n} />
      ))}
    </div>
  );
}
