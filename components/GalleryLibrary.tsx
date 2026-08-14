"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { KaliImage } from "@/types/image";
import { downloadImage } from "@/lib/download";
import DarshanModal from "./DarshanModal";
import RImage from "./RImage";
import FacetDropdown from "./FacetDropdown";
import Ornament from "./Ornament";
import FloatingGalleryButton from "./FloatingGalleryButton";

interface GalleryLibraryProps {
  images: KaliImage[];
  /** Cap the number of cards rendered (after filter + sort). Omit for the full /gallery page. */
  limit?: number;
  /** Show the "Open Gallery" CTA below the grid, linking to /gallery with the active filters carried over. */
  showOpenGalleryButton?: boolean;
  /** Element id for the section (home keeps "library" for the hero's scroll cue; /gallery doesn't need one). */
  id?: string;
  /**
   * Controlled selection — pass this + onSelectChange when a sibling (e.g.
   * the homepage's Hero wall) needs to open the same darshan modal. Omit to
   * let the component manage its own selection internally (the /gallery
   * page, which has no sibling that opens images).
   */
  selected?: KaliImage | null;
  onSelectChange?: (image: KaliImage | null) => void;
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
const MEDIA_TYPES = ["Sketch", "Wallpaper Mobile", "Wallpaper Desktop", "WhatsApp Sticker"];

function shuffle<T>(a: T[]): T[] {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isSortKey(v: string): v is SortKey {
  return SORT_OPTIONS.some((o) => o.value === v);
}

export default function GalleryLibrary({
  images,
  limit,
  showOpenGalleryButton,
  id,
  selected: controlledSelected,
  onSelectChange,
}: GalleryLibraryProps) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState("all");
  const [mediaType, setMediaType] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [openFacet, setOpenFacet] = useState<"form" | "type" | "sort" | null>(
    null
  );
  const [internalSelected, setInternalSelected] = useState<KaliImage | null>(
    null
  );
  const selected = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const setSelected = onSelectChange ?? setInternalSelected;

  // Arriving from another page with /gallery?form=…&type=…&sort=… preselects filters.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("form");
    const t = params.get("type");
    const s = params.get("sort");
    if (f && images.some((p) => p.form === f)) setForm(f);
    if (t && MEDIA_TYPES.includes(t)) setMediaType(t);
    if (s && isSortKey(s)) setSort(s);
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

  const visible = useMemo(
    () => (typeof limit === "number" ? sorted.slice(0, limit) : sorted),
    [sorted, limit]
  );

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

  // Prev/next within what's actually rendered (the preview shouldn't let the
  // modal wander into images that have no visible card on this page).
  const selectedIndex = selected
    ? visible.findIndex((p) => p.id === selected.id)
    : -1;
  const prev = selectedIndex > 0 ? visible[selectedIndex - 1] : undefined;
  const next =
    selectedIndex >= 0 && selectedIndex < visible.length - 1
      ? visible[selectedIndex + 1]
      : undefined;

  function toggleFacet(facet: "form" | "type" | "sort") {
    setOpenFacet((cur) => (cur === facet ? null : facet));
  }

  const galleryHref = useMemo(() => {
    const params = new URLSearchParams();
    if (form !== "all") params.set("form", form);
    if (mediaType !== "all") params.set("type", mediaType);
    if (sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    return qs ? `/gallery?${qs}` : "/gallery";
  }, [form, mediaType, sort]);

  return (
    <>
      <section className="lib wrap" id={id}>
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
        {showOpenGalleryButton && (
          <Link href={galleryHref} className="open-gallery-btn">
            Open Gallery
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="empty">She is not hidden here. Try another name.</div>
      ) : (
        <div className="grid">
          {visible.map((p, i) => (
            <button
              key={p.id}
              className="card rise"
              style={{ animationDelay: `${Math.min(i, 10) * 55}ms` }}
              aria-label={`Behold ${p.transliteration}`}
              onClick={() => setSelected(p)}
            >
              <motion.div
                className="card-media"
                layoutId={`darshan-img-${p.id}`}
                style={{ borderRadius: 12 }}
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
              </motion.div>
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

      {showOpenGalleryButton && id && (
        <FloatingGalleryButton sectionId={id} href={galleryHref} />
      )}
      </section>

      <DarshanModal
        image={selected}
        onClose={() => setSelected(null)}
        onPrev={prev ? () => setSelected(prev) : undefined}
        onNext={next ? () => setSelected(next) : undefined}
      />
    </>
  );
}
