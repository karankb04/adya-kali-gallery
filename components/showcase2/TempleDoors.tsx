"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import RImage from "../RImage";
import { sample } from "../showcase/sampleData";

/**
 * The sanctum doors (kapat) swing open as you scroll, revealing her darshan.
 * Doors are pure CSS (gradients + an inset gold border), so there are no
 * extra image downloads; only her photo is fetched.
 *
 * Pin + scrub on one timeline. Each door rotates on its outer hinge inside a
 * shared perspective, while the image behind settles from 1.12 to 1 so the
 * reveal reads as stepping closer, not as a zoom.
 */
export default function TempleDoors() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [img] = sample(3).slice(2);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stageRef.current?.classList.add("is-open");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    let tl: gsap.core.Timeline | undefined;
    const t = setTimeout(() => {
      const stage = stageRef.current;
      if (!stage) return;
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "center center",
          end: "+=110%",
          pin: true,
          scrub: 0.7,
        },
      });
      tl.to(stage.querySelector(".s2-door-l"), { rotateY: -112, ease: "none" }, 0)
        .to(stage.querySelector(".s2-door-r"), { rotateY: 112, ease: "none" }, 0)
        .fromTo(stage.querySelector(".s2-doors-img"), { scale: 1.12, filter: "brightness(.55)" }, { scale: 1, filter: "brightness(1)", ease: "none" }, 0)
        .fromTo(stage.querySelector(".s2-doors-cap"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: "none" }, 0.55);
      ScrollTrigger.refresh();
    }, 0);

    return () => {
      clearTimeout(t);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <div className="s2-doors" ref={stageRef}>
      <div className="s2-doors-frame">
        <div className="s2-doors-img">
          <RImage
            r2Key={img.r2Key}
            alt={`${img.transliteration} — ${img.form}`}
            width={img.width}
            height={img.height}
            dominantColor={img.dominantColor}
            sizes="(max-width:760px) 90vw, 520px"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="s2-door s2-door-l" aria-hidden="true"><span /></div>
        <div className="s2-door s2-door-r" aria-hidden="true"><span /></div>
      </div>
      <p className="s2-doors-cap">
        <span className="s2-doors-deva">{img.nameDevanagari}</span>
        {img.teachingCaption}
      </p>
    </div>
  );
}
