"use client";
import { KaliImage } from "@/types/image";

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

interface HeroProps {
  images: KaliImage[];
}

function WallColumn({
  images,
  duration,
  reverse,
}: {
  images: KaliImage[];
  duration: number;
  reverse?: boolean;
}) {
  const doubled = [...images, ...images];
  return (
    <div
      className="flex-1 flex flex-col gap-[10px] will-change-transform"
      style={{
        animation: `scrollY ${duration}s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {doubled.map((img, i) => (
        <div
          key={`${img.id}-${i}`}
          className="relative block w-full overflow-hidden rounded-[7px] bg-[#241208]"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,220,180,0.07)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={R2_BASE ? `${R2_BASE}/${img.r2Key}` : `https://placehold.co/400x${Math.round(400/( img.aspectRatio??0.8))}?text=Kali`}
            alt={img.transliteration}
            className="w-full block transition-all duration-500 hover:scale-105 hover:saturate-[1.2] saturate-[1.05]"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default function Hero({ images }: HeroProps) {
  const cols = 5;
  const chunks: KaliImage[][] = Array.from({ length: cols }, (_, i) =>
    images.filter((_, j) => j % cols === i)
  );
  // pad empty cols
  const filled = chunks.map((c) => (c.length ? c : images.slice(0, 2)));
  const durations = [52, 60, 44, 56, 48];

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#160a05]">
      {/* drifting wall */}
      <div className="absolute inset-[-2%_0] flex gap-[10px] justify-center items-start group">
        {filled.map((col, i) => (
          <WallColumn
            key={i}
            images={col}
            duration={durations[i]}
            reverse={i % 2 === 1}
          />
        ))}
      </div>

      {/* scrim */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,6,3,0.62) 0%, transparent 15%), linear-gradient(0deg, #f3eeeb 1.5%, rgba(243,238,235,0) 13%)",
        }}
      />

      {/* centre copy */}
      <div
        className="absolute inset-0 z-[8] flex flex-col items-center justify-center text-center pointer-events-none px-4"
        style={{
          background:
            "radial-gradient(46% 25% at 50% 50%, rgba(12,5,2,0.66), transparent 76%)",
        }}
      >
        <p
          className="font-deva font-semibold text-rose tracking-wide mb-3"
          style={{
            fontSize: "clamp(1rem,3vw,1.5rem)",
            textShadow: "0 2px 20px rgba(0,0,0,.6)",
          }}
        >
          जय माँ आद्या काली
        </p>

        <h1
          className="font-cinzel font-black text-cream leading-none"
          style={{
            fontSize: "clamp(2.8rem,10vw,9rem)",
            textShadow:
              "0 0 60px rgba(219,31,36,0.5), 0 4px 40px rgba(0,0,0,0.8)",
            letterSpacing: "2px",
          }}
        >
          ADYA KALI
        </h1>

        <p
          className="mt-4 max-w-[38ch] text-[rgba(251,242,228,0.92)] font-body"
          style={{
            fontSize: "clamp(0.96rem,2.2vw,1.16rem)",
            textShadow: "0 2px 18px rgba(0,0,0,.6)",
          }}
        >
          A living library of the Mother — sacred images, forms, and teachings.
        </p>

        <div className="mt-9 text-[0.7rem] font-semibold tracking-[0.26em] uppercase text-[rgba(251,242,228,0.75)]">
          Scroll to enter
          <div
            className="w-px h-8 bg-gradient-to-b from-[rgba(251,242,228,0.7)] to-transparent mx-auto mt-3"
            style={{ animation: "drop 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollY { from { transform: translateY(0) } to { transform: translateY(-50%) } }
        @keyframes drop { 0%,100%{opacity:.3;transform:scaleY(.6)} 50%{opacity:1;transform:scaleY(1)} }
        .group:hover > * { animation-play-state: paused !important; }
      `}</style>
    </section>
  );
}
