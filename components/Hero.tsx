"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
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

export default function Hero({ images, onOpen }: HeroProps) {
  const [cols, setCols] = useState<KaliImage[][]>([]);
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-zoom-hero pattern: as the hero scrolls past, the logo is pushed
  // and pulled vertically (parallax) with a subtle accompanying zoom —
  // scoped to just the logo, not the whole hero.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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
    <section className="hero" id="hero" ref={heroRef}>
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
                  dominantColor="#1c0e07"
                  quality={55}
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
          <motion.div
            style={{ y: logoY, scale: logoScale }}
          >
            <Image
              src="/title-adya-kali.webp"
              alt="Adya Kali"
              width={2000}
              height={721}
              priority
              sizes="(max-width:560px) 98vw, (max-width:980px) 94vw, 980px"
            />
          </motion.div>
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
