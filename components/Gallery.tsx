"use client";
import { useState, useMemo } from "react";
import { KaliImage } from "@/types/image";
import DarshanModal from "./DarshanModal";

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

interface GalleryProps {
  images: KaliImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const [query, setQuery] = useState("");
  const [activeForm, setActiveForm] = useState("All");
  const [activeAI, setActiveAI] = useState<"all" | "ai" | "traditional">("all");
  const [selected, setSelected] = useState<KaliImage | null>(null);

  const forms = useMemo(
    () => ["All", ...Array.from(new Set(images.map((i) => i.form)))],
    [images]
  );

  const filtered = useMemo(() => {
    return images.filter((img) => {
      const q = query.toLowerCase();
      const matchesQ =
        !q ||
        img.nameDevanagari.includes(q) ||
        img.transliteration.toLowerCase().includes(q) ||
        img.form.toLowerCase().includes(q) ||
        img.teachingCaption.toLowerCase().includes(q);
      const matchesForm = activeForm === "All" || img.form === activeForm;
      const matchesAI =
        activeAI === "all" ||
        (activeAI === "ai" && img.isAI) ||
        (activeAI === "traditional" && !img.isAI);
      return matchesQ && matchesForm && matchesAI;
    });
  }, [images, query, activeForm, activeAI]);

  return (
    <>
      <section id="gallery" className="max-w-[1320px] mx-auto px-[clamp(1rem,4vw,2.4rem)] pt-16 pb-4 relative z-10">
        {/* heading */}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <h2
            className="font-display font-bold text-ink leading-none tracking-tight"
            style={{ fontSize: "clamp(1.7rem,4vw,2.5rem)" }}
          >
            The Library
          </h2>
          <p className="text-ink-soft text-[0.98rem] max-w-[46ch] mt-1">
            Sacred images of the Mother in her many forms — each a doorway to
            darshan.
          </p>
          <p className="text-[0.72rem] font-bold text-red tracking-[0.14em] uppercase mt-2">
            {filtered.length} of {images.length} forms
          </p>
        </div>

        {/* search */}
        <div className="relative w-full max-w-[560px] mx-auto mb-5">
          <span className="absolute left-[1.05rem] top-1/2 -translate-y-1/2 text-red text-[1.05rem]">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Search by name, form, or teaching…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full font-body text-[1.02rem] text-ink bg-paper border-[1.5px] border-line rounded-2xl py-[0.95rem] pr-4 pl-10 outline-none focus:border-red focus:shadow-[0_0_0_4px_rgba(219,31,36,0.1)] transition-all placeholder-[#a89a90]"
          />
        </div>

        {/* filter chips */}
        <div className="flex flex-col items-center gap-3 mb-10">
          {/* forms */}
          <div className="flex flex-wrap justify-center gap-2">
            {forms.map((form) => (
              <button
                key={form}
                onClick={() => setActiveForm(form)}
                className={`text-[0.82rem] font-medium rounded-full px-4 py-[0.42rem] border-[1.5px] transition-all whitespace-nowrap cursor-pointer ${
                  activeForm === form
                    ? "bg-red text-white border-red shadow-[0_6px_16px_-8px_rgba(219,31,36,0.7)]"
                    : "text-ink-soft bg-paper border-line hover:text-ink hover:border-red"
                }`}
              >
                {form}
              </button>
            ))}
          </div>

          {/* AI filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {(
              [
                { key: "all", label: "All Sources" },
                { key: "traditional", label: "Traditional" },
                { key: "ai", label: "AI Generated" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveAI(key)}
                className={`text-[0.82rem] font-medium rounded-full px-4 py-[0.42rem] border-[1.5px] transition-all cursor-pointer ${
                  activeAI === key
                    ? "bg-red text-white border-red shadow-[0_6px_16px_-8px_rgba(219,31,36,0.7)]"
                    : "text-ink-soft bg-paper border-line hover:text-ink hover:border-red"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* masonry grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-ink-soft py-14 text-[1.05rem]">
            No images match your search.
          </p>
        ) : (
          <div className="columns-masonry">
            {filtered.map((img) => {
              const src = R2_BASE
                ? `${R2_BASE}/${img.r2Key}`
                : `https://placehold.co/400x${Math.round(400 / (img.aspectRatio ?? 0.8))}?text=${encodeURIComponent(img.transliteration)}`;
              return (
                <button
                  key={img.id}
                  onClick={() => setSelected(img)}
                  className="break-inside-avoid mb-4 relative block w-full border-none p-0 cursor-pointer rounded-xl overflow-hidden bg-[#e7ddd6] text-left shadow-[0_8px_26px_-16px_rgba(60,20,8,0.5)] transition-all duration-500 hover:-translate-y-[5px] hover:shadow-[0_22px_50px_-20px_rgba(120,20,15,0.5)] focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-[3px] group/card"
                  style={{ marginBottom: "1rem" }}
                >
                  {/* download button */}
                  <a
                    href={src}
                    download={`${img.id}.jpg`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[0.55rem] left-[0.55rem] z-[3] w-[34px] h-[34px] rounded-full grid place-items-center text-white bg-[rgba(20,8,4,0.55)] backdrop-blur-sm opacity-0 -translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all shadow-[0_4px_14px_-6px_rgba(0,0,0,0.6)] hover:bg-red"
                    style={{ pointerEvents: "auto" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={img.transliteration}
                    className="w-full block transition-transform duration-500 group-hover/card:scale-[1.04]"
                    loading="lazy"
                  />

                  {/* caption overlay */}
                  <div className="absolute left-0 right-0 bottom-0 px-[0.9rem] pt-[1.6rem] pb-[0.8rem] bg-gradient-to-t from-[rgba(20,8,4,0.9)] to-transparent">
                    <p className="font-deva font-semibold text-white text-[1.05rem] leading-tight" style={{ textShadow: "0 1px 6px #000" }}>
                      {img.nameDevanagari}
                    </p>
                    <p className="text-rose text-[0.84rem] font-medium mt-[0.05rem]">
                      {img.transliteration}
                    </p>
                    <p className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-[rgba(251,242,228,0.7)] mt-[0.4rem]">
                      {img.form}
                    </p>
                  </div>

                  {/* AI tag */}
                  {img.isAI && (
                    <span className="absolute bottom-[0.6rem] right-[0.6rem] z-[3] text-[0.58rem] font-bold tracking-[0.1em] uppercase px-[0.55rem] py-[0.28rem] rounded-full bg-[rgba(12,6,4,0.62)] text-[#ffe1c4] border border-[rgba(255,190,140,0.45)] backdrop-blur-sm opacity-0 translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <DarshanModal image={selected} onClose={() => setSelected(null)} />
    </>
  );
}
