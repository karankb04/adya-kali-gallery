"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import RImage from "./RImage";

export interface SevaItem {
  r2Key: string;
  width?: number;
  height?: number;
  dominantColor?: string;
  eyebrow: string;
  title: string;
  text: string;
}

/**
 * Per-image useScroll + useTransform (motion.dev's react-scroll-image-reveal
 * pattern): a curtain clip-path opens from the center as the row crosses the
 * viewport, with a subtle parallax scale on the image itself underneath.
 * Text sits alongside, alternating sides row to row.
 */
function SevaRow({ item, index }: { item: SevaItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    (v) => `inset(0 ${(1 - v) * 50}% 0 ${(1 - v) * 50}%)`
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  return (
    <div className={`seva-row${index % 2 ? " reverse" : ""}`} ref={ref}>
      <div className="seva-media">
        <motion.div className="seva-media-clip" style={{ clipPath }}>
          <motion.div style={{ scale, width: "100%", height: "100%" }}>
            <RImage
              r2Key={item.r2Key}
              alt={item.title}
              width={item.width}
              height={item.height}
              dominantColor={item.dominantColor}
              sizes="(max-width:820px) 92vw, 500px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        </motion.div>
      </div>
      <div className="seva-text">
        <div className="seva-eyebrow">{item.eyebrow}</div>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </div>
  );
}

export default function ScrollImageReveal({ items }: { items: SevaItem[] }) {
  return (
    <div className="seva-list">
      {items.map((item, i) => (
        <SevaRow key={item.title} item={item} index={i} />
      ))}
    </div>
  );
}
