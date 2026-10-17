"use client";
import { useEffect, useRef, useState } from "react";
import RImage from "../RImage";
import { sample } from "../showcase/sampleData";

/**
 * As each darshan comes to the centre of the screen, the whole section is
 * washed in that image's own dominant colour, so the room seems to take on
 * her aura. The colour is already stored per image (dominantColor), so
 * nothing is computed or downloaded; it's one CSS variable and a transition.
 */
export default function AmbientWash() {
  const items = sample(5);
  const [color, setColor] = useState(items[0]?.dominantColor ?? "#241208");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const figs = Array.from(root.querySelectorAll<HTMLElement>(".s2-wash-fig"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setColor((e.target as HTMLElement).dataset.color || "#241208");
        }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    figs.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  return (
    <div className="s2-wash" ref={rootRef} style={{ ["--wash" as string]: color }}>
      {items.map((p) => (
        <figure className="s2-wash-fig" key={p.id} data-color={p.dominantColor ?? "#241208"}>
          <div className="s2-wash-media">
            <RImage
              r2Key={p.r2Key}
              alt={`${p.transliteration} — ${p.form}`}
              width={p.width}
              height={p.height}
              dominantColor={p.dominantColor}
              sizes="(max-width:760px) 80vw, 380px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <figcaption>
            <span className="s2-wash-deva">{p.nameDevanagari}</span>
            <span className="s2-wash-tr">{p.transliteration}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
