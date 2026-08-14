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
import FacetDropdown from "./FacetDropdown";

interface KaliAppProps {
  images: KaliImage[];
}

type SortKey = "newest" | "popular" | "random" | "featured";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "random", label: "Random" },
  { value: "featured", label: "Featured" },
];

// Fixed media-format taxonomy (not data-driven like Form — these are stable
// content buckets the site defines, not something new deities add to).
const MEDIA_TYPES = [
  "Sketch",
  "Wallpaper Mobile",
  "Wallpaper Desktop",
  "WhatsApp Sticker",
];

function shuffle<T>(a: T[]): T[] {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function KaliApp({ images }: KaliAppProps) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState("all");
  const [mediaType, setMediaType] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [openFacet, setOpenFacet] = useState<"form" | "type" | "sort" | null>(
    null
  );
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
      if (mediaType !== "all" && p.mediaType !== mediaType) return false;
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
  }, [images, query, form, mediaType]);

  // Sort is a separate pass over the filtered set — filtering decides *what*
  // shows, sorting decides *what order*. Newest keeps the curator's existing
  // order (from the Sheet's `order` field) untouched.
  const sorted = useMemo(() => {
    if (sort === "newest") return filtered;
    if (sort === "random") return shuffle(filtered);
    if (sort === "popular") {
      return [...filtered].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    }
    // featured
    return [...filtered].sort(
      (a, b) => Number(!!b.featured) - Number(!!a.featured)
    );
  }, [filtered, sort]);

  const formOptions = useMemo(
    () => [
      { value: "all", label: "All forms", count: images.length },
      ...forms.map((f) => ({
        value: f,
        label: f,
        count: images.filter((p) => p.form === f).length,
      })),
    ],
    [forms, images]
  );

  const typeOptions = useMemo(
    () => [
      { value: "all", label: "All types", count: images.length },
      ...MEDIA_TYPES.map((t) => ({
        value: t,
        label: t,
        count: images.filter((p) => p.mediaType === t).length,
      })),
    ],
    [images]
  );

  // Prev/next within the current sorted set (for the darshan modal).
  const selectedIndex = selected
    ? sorted.findIndex((p) => p.id === selected.id)
    : -1;
  const prev = selectedIndex > 0 ? sorted[selectedIndex - 1] : undefined;
  const next =
    selectedIndex >= 0 && selectedIndex < sorted.length - 1
      ? sorted[selectedIndex + 1]
      : undefined;

  function navTo(f: string) {
    setForm(f);
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleFacet(facet: "form" | "type" | "sort") {
    setOpenFacet((cur) => (cur === facet ? null : facet));
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
          <div className="count">{sorted.length} darshan</div>
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

        <div className="facetbar">
          <FacetDropdown
            label="Form"
            buttonLabel={form === "all" ? "All" : form}
            active={form !== "all"}
            options={formOptions}
            value={form}
            open={openFacet === "form"}
            onToggle={() => toggleFacet("form")}
            onClose={() => setOpenFacet(null)}
            onSelect={(v) => {
              setForm(v);
              setOpenFacet(null);
            }}
          />
          <FacetDropdown
            label="Type"
            buttonLabel={mediaType === "all" ? "All" : mediaType}
            active={mediaType !== "all"}
            options={typeOptions}
            value={mediaType}
            open={openFacet === "type"}
            onToggle={() => toggleFacet("type")}
            onClose={() => setOpenFacet(null)}
            onSelect={(v) => {
              setMediaType(v);
              setOpenFacet(null);
            }}
          />
          <FacetDropdown
            label="Sort by"
            buttonLabel={
              SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Newest"
            }
            active={sort !== "newest"}
            options={SORT_OPTIONS}
            value={sort}
            open={openFacet === "sort"}
            onToggle={() => toggleFacet("sort")}
            onClose={() => setOpenFacet(null)}
            onSelect={(v) => {
              setSort(v as SortKey);
              setOpenFacet(null);
            }}
          />
        </div>

        {sorted.length === 0 ? (
          <div className="empty">She is not hidden here. Try another name.</div>
        ) : (
          <div className="grid">
            {sorted.map((p, i) => (
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
