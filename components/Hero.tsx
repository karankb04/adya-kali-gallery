"use client";
import { useEffect, useState } from "react";
import { KaliImage } from "@/types/image";
import RImage from "./RImage";

interface HeroProps {
  images: KaliImage[];
  onOpen: (img: KaliImage) => void;
}

function shuffle<T>(a: T[]): T[] {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DURS = [30, 38, 33, 42, 35, 29, 40];

function colCount(w: number): number {
  return w < 480 ? 3 : w < 760 ? 4 : w < 1100 ? 5 : w < 1400 ? 6 : 7;
}

// ---- carved-metal title (faithful to original SVG) ----
const SHADES = ["#3a0507", "#460709", "#52090b", "#5e0b0d", "#6a0d0f", "#760f11", "#820f12", "#8d1013"];

function TitleSvg() {
  const ext = [];
  for (let k = 8; k >= 1; k--) {
    ext.push(
      <text key={k} x="500" y={150 + k} fill={SHADES[8 - k]}>
        ADYA KALI
      </text>
    );
  }
  return (
    <svg className="title-svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Adya Kali">
      <defs>
        <linearGradient id="redmetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff1212" />
          <stop offset="0.22" stopColor="#e60010" />
          <stop offset="0.46" stopColor="#bd000e" />
          <stop offset="0.66" stopColor="#8c0008" />
          <stop offset="0.84" stopColor="#5e0005" />
          <stop offset="1" stopColor="#3a0003" />
        </linearGradient>
        <linearGradient id="goldrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9b0" />
          <stop offset="0.5" stopColor="#d9a23e" />
          <stop offset="1" stopColor="#7c531a" />
        </linearGradient>
        <filter id="metal" x="-15%" y="-40%" width="130%" height="190%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b" />
          <feSpecularLighting in="b" surfaceScale="4" specularConstant="0.42" specularExponent="24" lightingColor="#ff5446" result="sp">
            <feDistantLight azimuth="232" elevation="58" />
          </feSpecularLighting>
          <feComposite in="sp" in2="SourceAlpha" operator="in" result="spc" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="spc" />
          </feMerge>
        </filter>
        <filter id="glow" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="7" result="g" />
          <feMerge>
            <feMergeNode in="g" />
          </feMerge>
        </filter>
      </defs>
      <text x="500" y="150" fill="#ff0613" opacity="0.55" filter="url(#glow)">
        ADYA KALI
      </text>
      {ext}
      <text x="500" y="150" fill="url(#redmetal)" stroke="url(#goldrim)" strokeWidth="1.3" filter="url(#metal)">
        ADYA KALI
      </text>
    </svg>
  );
}

function Ribbons() {
  return (
    <svg className="tw-layer ribbons" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="silk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a0c0e" />
          <stop offset="0.35" stopColor="#e21f1f" />
          <stop offset="0.6" stopColor="#ff4a39" />
          <stop offset="0.8" stopColor="#c0151a" />
          <stop offset="1" stopColor="#6e0a0e" />
        </linearGradient>
        <linearGradient id="silk2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e0a0e" />
          <stop offset="0.4" stopColor="#d11a1f" />
          <stop offset="0.7" stopColor="#ff5a45" />
          <stop offset="1" stopColor="#7a0c0e" />
        </linearGradient>
        <filter id="soft">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      <path
        className="rb"
        filter="url(#soft)"
        fill="url(#silk)"
        opacity="0.8"
        d="M-40 120 C 220 40, 340 210, 560 150 C 760 96, 900 230, 1040 150 L1040 210 C 880 300, 740 170, 540 220 C 320 276, 200 130, -40 200 Z"
      />
      <path
        className="rb2"
        filter="url(#soft)"
        fill="url(#silk2)"
        opacity="0.68"
        d="M-40 230 C 200 300, 360 150, 560 210 C 780 276, 880 140, 1040 220 L1040 270 C 870 200, 770 320, 540 260 C 330 206, 210 330, -40 280 Z"
      />
    </svg>
  );
}

export default function Hero({ images, onOpen }: HeroProps) {
  const [cols, setCols] = useState<KaliImage[][]>([]);

  useEffect(() => {
    function build() {
      const n = colCount(window.innerWidth);
      const out: KaliImage[][] = [];
      for (let c = 0; c < n; c++) {
        const seq = shuffle(images);
        out.push(seq.concat(seq)); // doubled for seamless loop
      }
      setCols(out);
    }
    build();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(build, 300);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [images]);

  return (
    <section className="hero" id="hero">
      <div className="wall" id="wall">
        {cols.map((col, ci) => (
          <div
            key={ci}
            className="col"
            style={
              {
                "--dur": `${DURS[ci % DURS.length]}s`,
                "--dir": ci % 2 ? "reverse" : "normal",
                animationDelay: `${-(Math.random() * 40).toFixed(1)}s`,
              } as React.CSSProperties
            }
          >
            {col.map((p, i) => (
              <button
                key={`${p.id}-${i}`}
                className="tile"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onOpen(p)}
              >
                <RImage
                  r2Key={p.r2Key}
                  alt=""
                  width={p.width}
                  height={p.height}
                  dominantColor={p.dominantColor}
                  sizes="(max-width:480px) 33vw, (max-width:1100px) 20vw, 14vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="scrim" />

      <div className="hero-c">
        <div className="deva">॥ जय माँ आद्या ॥</div>
        <div className="title-wrap">
          <Ribbons />
          <TitleSvg />
        </div>
        <p>
          A living library of the Mother — her every face, gathered in one place
          for all the world to behold.
        </p>
        <div className="cue">
          The Library
          <b />
        </div>
      </div>
    </section>
  );
}
