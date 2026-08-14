"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Ornament from "./Ornament";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  deva?: string;
  title: string;
  sub?: string;
  items: FaqItem[];
}

/**
 * Accordion with a plus-to-minus icon morph and a Motion height:auto expand
 * — plain CSS can't transition to/from "auto", which is exactly the case
 * Motion's layout animation handles cleanly. One item open at a time,
 * matching motion.dev/ui/faq-sections' accordion behavior.
 */
export default function FaqSection({ deva, title, sub, items }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <section className="faq wrap">
      <div className="lib-head">
        <Ornament className="lib-orn" />
        {deva && <div className="faq-deva">{deva}</div>}
        <h2>{title}</h2>
        {sub && <div className="sub">{sub}</div>}
      </div>

      <div className="faq-list">
        {items.map((item, i) => {
          const open = openIndex === i;
          return (
            <div
              key={i}
              className={`faq-item rise${open ? " open" : ""}`}
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <button
                type="button"
                className="faq-q"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  <span className="faq-bar faq-bar-h" />
                  <span className="faq-bar faq-bar-v" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    className="faq-a-wrap"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <p className="faq-a">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
