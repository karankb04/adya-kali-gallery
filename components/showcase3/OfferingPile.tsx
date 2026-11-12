"use client";
import { useEffect, useRef, useState } from "react";
import { KaliImage } from "@/types/image";
import RImage from "@/components/RImage";
import { panelSize } from "@/lib/arc";
import { pileLayout, readCount, writeCount } from "@/lib/pile";

const CARD_H = 120;
const HEAP_H = 420;
const MAX_PETALS = 60;

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Click to Keep's pile of saved things, turned into an offering: her
 * darshans drop one by one into a heap as the section arrives, and each
 * pranam adds a marigold petal to it. The count stays on this device.
 */
export default function OfferingPile({ images }: { images: KaliImage[] }) {
  const heapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(800);
  const [shown, setShown] = useState(0);
  const [count, setCount] = useState(0);
  const cards = images.slice(0, 16);

  useEffect(() => {
    setCount(readCount(storage()));
    const heap = heapRef.current;
    if (!heap) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(heap);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (still) return setShown(cards.length);
        let n = 0;
        timer = window.setInterval(() => {
          setShown(++n);
          if (n >= cards.length) window.clearInterval(timer);
        }, 140);
      },
      { threshold: 0.35 }
    );
    io.observe(heap);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [cards.length]);

  const offer = () => {
    const next = count + 1;
    setCount(next);
    writeCount(storage(), next);
  };

  // Keep cards and petals clear of the heap's edges.
  const area = { w: Math.max(0, w - 120), h: HEAP_H - CARD_H - 20 };
  const cardSpots = pileLayout(cards.length, 108, area);
  const petalSpots = pileLayout(Math.min(count, MAX_PETALS), 2026, { w: Math.max(0, w - 40), h: HEAP_H - 40 });

  return (
    <div className="s3-pile">
      <div className="s3-pile-bar">
        <button className="s3-pile-btn" onClick={offer}>
          Offer a pranam
        </button>
        <p className="s3-pile-count" aria-live="polite">
          You&apos;ve offered <strong>{String(count).padStart(2, "0")}</strong> pranams
        </p>
      </div>

      <div ref={heapRef} className="s3-pile-heap" style={{ height: HEAP_H }}>
        {cards.map((img, i) => {
          const s = cardSpots[i];
          const { width } = panelSize(img, CARD_H);
          return (
            <div
              key={img.id}
              className={`s3-pile-card${i < shown ? " is-in" : ""}`}
              style={{
                width,
                height: CARD_H,
                left: s.x + 60 - width / 2,
                top: s.y,
                // Landed position; `.is-in` removes the drop offset.
                ["--r" as string]: `${s.rotate}deg`,
                ["--s" as string]: s.scale,
              }}
            >
              <RImage
                r2Key={img.r2Key}
                alt={img.altText ?? img.transliteration}
                fill
                sizes={`${Math.round(width)}px`}
                dominantColor={img.dominantColor}
                style={{ objectFit: "contain" }}
              />
            </div>
          );
        })}
        {petalSpots.map((p, i) => (
          <span
            key={i}
            className="s3-pile-petal"
            aria-hidden="true"
            style={{ left: p.x + 20, top: p.y + 20, ["--r" as string]: `${p.rotate * 6}deg` }}
          />
        ))}
      </div>
    </div>
  );
}
