import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Ornament from "@/components/Ornament";
import RevealGrid from "@/components/showcase/RevealGrid";
import ScrollImageReveal from "@/components/ScrollImageReveal";
import Coverflow from "@/components/Coverflow";
import FaqSection from "@/components/FaqSection";
import MantraRibbon from "@/components/MantraRibbon";
import { ABOUT_FAQS } from "@/content/faqs";

export const metadata: Metadata = {
  title: "About",
  robots: { index: false, follow: true },
};

// Placeholder seva content — reuses existing gallery images as stand-in
// visuals until real seva/annadanam photography is provided.
const SEVA_ITEMS = [
  {
    r2Key: "A0BB96A6-5C94-4808-9C55-C0C1BB8CAEE6.jpg",
    width: 832,
    height: 1109,
    dominantColor: "#824e41",
    eyebrow: "Annadanam",
    title: "Free meals, offered without condition",
    text: "[Placeholder] A short line about the annadanam seva — who it serves, how often it runs, and what it means to the mission.",
  },
  {
    r2Key: "WhatsApp Image 2026-04-14 at 17.37.43.jpeg",
    width: 1080,
    height: 1350,
    dominantColor: "#4b1e1a",
    eyebrow: "Vastra Daan",
    title: "Clothing for those who need it most",
    text: "[Placeholder] A short line about the vastra daan seva — where donations go and how devotees can contribute.",
  },
  {
    r2Key: "WhatsApp Image 2026-06-24 at 06.37.14.jpeg",
    width: 1402,
    height: 1122,
    dominantColor: "#a87650",
    eyebrow: "Vidya Daan",
    title: "Supporting a child's education",
    text: "[Placeholder] A short line about the vidya daan seva — the students it supports and how it's funded.",
  },
];

const COVERFLOW_ITEMS = [
  { r2Key: "64b871d7-e7e0-410d-9213-3f35f2e474a5 (1).jpeg", width: 1024, height: 1536, dominantColor: "#701d0c", label: "Adya Kali" },
  { r2Key: "IMG_3734.PNG", width: 864, height: 1184, dominantColor: "#86645f", label: "Maha Kali" },
  { r2Key: "SaveClip.App_618911727_17887876374419895_5214875700262540593_n.jpg", width: 862, height: 1080, dominantColor: "#7a6b61", label: "Kali Ma" },
  { r2Key: "WhatsApp Image 2026-06-22 at 05.28.26.jpeg", width: 1026, height: 1280, dominantColor: "#492817", label: "Mahakali" },
  { r2Key: "WhatsApp Image 2026-06-24 at 05.43.04.jpeg", width: 900, height: 1600, dominantColor: "#2e2e2e", label: "Shmashana Kali" },
  { r2Key: "WhatsApp Image 2026-06-24 at 08.51.31.jpeg", width: 851, height: 1280, dominantColor: "#89562e", label: "Rakta Kali" },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader variant="page" />
      <section className="gallery-hero" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
        <div className="wrap">
          <div className="gallery-hero-deva">परिचय</div>
          <h1>About</h1>
          <p className="gallery-hero-dek">
            The story of Adya Kali and the KaliPutra Mission — coming soon.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Ornament />
          </div>
        </div>
      </section>

      {/* ---------- REVEAL CARDS (placeholder content) ---------- */}
      <section className="about-section wrap">
        <div className="lib-head">
          <Ornament className="lib-orn" />
          <h2>Moments from the mission</h2>
          <div className="sub">[Placeholder] Content to be decided later.</div>
        </div>
        <RevealGrid />
      </section>

      {/* ---------- SCROLL IMAGE REVEAL: seva / annadanam ---------- */}
      <section className="about-section about-section-alt wrap">
        <div className="lib-head">
          <Ornament className="lib-orn" />
          <h2>Her seva, in the world</h2>
          <div className="sub">
            [Placeholder] The sevas and annadanams carried out by the mission.
          </div>
        </div>
        <ScrollImageReveal items={SEVA_ITEMS} />
      </section>

      {/* ---------- MANTRA RIBBON ---------- */}
      <MantraRibbon />

      {/* ---------- COVERFLOW (placeholder content) ---------- */}
      <section className="about-section wrap">
        <div className="lib-head">
          <Ornament className="lib-orn" />
          <h2>Her many faces</h2>
          <div className="sub">[Placeholder] Content to be decided later.</div>
        </div>
        <Coverflow items={COVERFLOW_ITEMS} />
      </section>

      <FaqSection
        deva="प्रश्न"
        title="Questions about the mission"
        sub="Everything you might want to know about who we are."
        items={ABOUT_FAQS}
      />

      <SiteFooter />
    </>
  );
}
