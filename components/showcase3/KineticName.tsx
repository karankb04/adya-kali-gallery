"use client";
import { useEffect, useState } from "react";
import TextPressure from "@/components/reactbits/TextPressure";
import ScrollFloat from "@/components/reactbits/ScrollFloat";

/**
 * Her name across the full width; each letter swells in weight and width as
 * the cursor nears it (variable-font axes, no images). Touch screens and
 * reduced motion get the same word, still.
 */
export default function KineticName() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="s3-kinetic">
      <div className="s3-kinetic-name">
        {still ? (
          <p className="s3-kinetic-still">MAHAKALI</p>
        ) : (
          <TextPressure
            text="MAHAKALI"
            fontFamily="var(--f3-bricolage)"
            fontUrl=""
            italic={false}
            alpha={false}
            textColor="#fbf2e4"
            minFontSize={48}
          />
        )}
      </div>
      <ScrollFloat containerClassName="s3-kinetic-float" textClassName="s3-kinetic-float-text">
        She who is beyond time
      </ScrollFloat>
    </div>
  );
}
