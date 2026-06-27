"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { KaliImage } from "@/types/image";
import { r2url } from "@/lib/r2";
import { downloadImage } from "@/lib/download";
import Hero from "./Hero";
import DarshanModal from "./DarshanModal";

interface KaliAppProps {
  images: KaliImage[];
}

// Nav shortcuts map evocative labels to actual form values present in the data.
const NAV_FORMS: { label: string; form: string }[] = [
  { label: "Smashan", form: "Shmashana Kali" },
  { label: "Dakshina", form: "Dakshina Kali" },
];

export default function KaliApp({ images }: KaliAppProps) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState("all");
  const [selected, setSelected] = useState<KaliImage | null>(null);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  function navTo(f: string) {
    setForm(f);
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ---------- top bar ---------- */}
      <header className={`bar${solid ? " solid" : ""}`} id="bar">
        <div className="mark">
          <Image src="/logo.png" alt="" width={38} height={38} priority />
        </div>
        <nav className="navlinks">
          <a
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("library")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            The Library
          </a>
          {NAV_FORMS.map((n) => (
            <a
              key={n.label}
              onClick={(e) => {
                e.preventDefault();
                navTo(n.form);
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div style={{ width: 38 }} />
      </header>

      {/* ---------- HERO ---------- */}
      <Hero images={images} onOpen={setSelected} />

      {/* ---------- LIBRARY ---------- */}
      <section className="lib wrap" id="library">
        <div className="lib-head">
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
            {filtered.map((p) => (
              <button
                key={p.id}
                className="card"
                aria-label={`Behold ${p.transliteration}`}
                onClick={() => setSelected(p)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r2url(p.r2Key)}
                  alt={`${p.transliteration} — ${p.form}`}
                  loading="lazy"
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

      <footer>
        <div className="fdeva">॥ जय माँ आद्या महाकाली ॥</div>
        <div className="fline">Spread her naam across all the worlds.</div>
        <div className="fsub">
          Adya Kali — a seva of devotion, never of commerce
        </div>
        <div className="cred">Images · KaliPutra Mission · Creative Bench</div>
      </footer>

      <DarshanModal image={selected} onClose={() => setSelected(null)} />
    </>
  );
}
