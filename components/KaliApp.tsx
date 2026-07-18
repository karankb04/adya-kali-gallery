"use client";
import { useEffect, useMemo, useState } from "react";
import { KaliImage } from "@/types/image";
import { downloadImage } from "@/lib/download";
import Hero from "./Hero";
import DarshanModal from "./DarshanModal";
import RImage from "./RImage";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import Ornament from "./Ornament";

interface KaliAppProps {
  images: KaliImage[];
}

export default function KaliApp({ images }: KaliAppProps) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState("all");
  const [selected, setSelected] = useState<KaliImage | null>(null);

  // Arriving from another page with /?form=…#library preselects the filter.
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("form");
    if (f && images.some((p) => p.form === f)) setForm(f);
  }, [images]);

  const forms = useMemo(() => {
    const out: string[] = [];
    images.forEach((p) => {
      if (out.indexOf(p.form) < 0) out.push(p.form);
    });
    return out;
  }, [images]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return images.filter((p) => {
      if (form !== "all" && p.form !== form) return false;
      if (q) {
        const hay = (
          p.transliteration +
          " " +
          p.nameDevanagari +
          " " +
          p.form +
          " " +
          p.teachingCaption
        ).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }, [images, query, form]);

  // Prev/next within the current filtered set (for the darshan modal).
  const selectedIndex = selected
    ? filtered.findIndex((p) => p.id === selected.id)
    : -1;
  const prev =
    selectedIndex > 0 ? filtered[selectedIndex - 1] : undefined;
  const next =
    selectedIndex >= 0 && selectedIndex < filtered.length - 1
      ? filtered[selectedIndex + 1]
      : undefined;

  function navTo(f: string) {
    setForm(f);
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <SiteHeader
        variant="hero"
        onNavForm={navTo}
        onNavLibrary={() =>
          document
            .getElementById("library")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* ---------- HERO ---------- */}
      <Hero images={images} onOpen={setSelected} />

      {/* ---------- LIBRARY ---------- */}
      <section className="lib wrap" id="library">
        <div className="lib-head">
          <Ornament className="lib-orn" />
          <h2>Her Faces</h2>
          <div className="sub">
            New darshan, offered by her children. Search her names, filter her
            forms.
          </div>
          <div className="count">{filtered.length} darshan</div>
        </div>

        <div className="search">
          <span className="ic">⌕</span>
          <input
            type="text"
            placeholder="Search her names, her forms…"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filterbar">
          <div className="fgroup">
            <span className="flabel">Form</span>
            <div className="fpills">
              <button
                className={`chip${form === "all" ? " on" : ""}`}
                onClick={() => setForm("all")}
              >
                All forms
              </button>
              {forms.map((f) => (
                <button
                  key={f}
                  className={`chip${form === f ? " on" : ""}`}
                  onClick={() => setForm(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">She is not hidden here. Try another name.</div>
        ) : (
          <div className="grid">
            {filtered.map((p, i) => (
              <button
                key={p.id}
                className="card rise"
                style={{ animationDelay: `${Math.min(i, 10) * 55}ms` }}
                aria-label={`Behold ${p.transliteration}`}
                onClick={() => setSelected(p)}
              >
                <RImage
                  r2Key={p.r2Key}
                  alt={p.altText ?? `${p.transliteration} — ${p.form}`}
                  width={p.width}
                  height={p.height}
                  dominantColor={p.dominantColor}
                  sizes="(max-width:560px) 50vw, (max-width:1320px) 25vw, 320px"
                  style={{ width: "100%", height: "auto" }}
                />
                {p.isAI && <span className="aitag">✦ AI</span>}
                <span
                  className="dl"
                  role="button"
                  tabIndex={0}
                  aria-label={`Download ${p.transliteration}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    downloadImage(p);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      downloadImage(p);
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v12" />
                    <path d="M7 11l5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </span>
                <div className="cap">
                  <div className="nm">{p.nameDevanagari}</div>
                  <div className="tr">{p.transliteration}</div>
                  <div className="fm">{p.form}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />

      <DarshanModal
        image={selected}
        onClose={() => setSelected(null)}
        onPrev={prev ? () => setSelected(prev) : undefined}
        onNext={next ? () => setSelected(next) : undefined}
      />
    </>
  );
}
