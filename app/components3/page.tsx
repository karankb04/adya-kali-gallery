import type { Metadata } from "next";
import "../components/showcase.css";
import "../components2/showcase2.css";
import "./showcase3.css";
import { FONT_VARS } from "./fonts";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShowcaseSection from "@/components/showcase/ShowcaseSection";
import TypeSystems from "@/components/showcase3/TypeSystems";
import KargoArc from "@/components/showcase3/KargoArc";
import DomeDarshan from "@/components/showcase3/DomeDarshan";
import KineticName from "@/components/showcase3/KineticName";
import EditorialChrome from "@/components/showcase3/EditorialChrome";
import { getImages } from "@/lib/images";

// Internal proposals page — not linked from site nav, not indexed.
export const metadata: Metadata = {
  title: "Component Proposals III",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function ComponentsThree() {
  const images = await getImages();
  return (
    <div className={`sc-page s3-page ${FONT_VARS}`}>
      <SiteHeader />

      <header className="s2-intro">
        <p className="s2-intro-deva" lang="hi">रूप</p>
        <h1>Proposals III — She can&apos;t do basic</h1>
        <p className="s2-intro-dek">
          A new voice for the type, a curved sanctum wall in the spirit of Kargo
          Studio, and the editorial boldness of Click to Keep, each built with
          her own images, whole and uncropped. Pick what moves you; nothing here
          touches the live site yet.
        </p>
      </header>

      <ShowcaseSection
        index={1}
        technique="Type systems · same words, five voices"
        title="A voice worthy of her"
        description="The same nav, headline, Hindi line, label and teaching, set five ways beside today's fonts. Judge the feeling first; every option keeps Tiro Devanagari for Hindi and the two header buttons as they are."
        bleed
      >
        <TypeSystems />
      </ShowcaseSection>

      <ShowcaseSection
        index={2}
        technique="Kargo-style arc · CSS 3D · whole images"
        title="The sanctum's curved wall"
        description="Her darshans line the inside of a curved wall that turns as you scroll or drag, after Kargo Studio's works page. Unlike Kargo's thin strips, every panel takes the image's own shape, so nothing of Maa is cut. Tap any panel to open it."
        bleed
      >
        <KargoArc images={images} />
      </ShowcaseSection>

      <ShowcaseSection
        index={3}
        technique="Dome gallery · React Bits · drag to turn"
        title="A dome of her forms"
        description="An alternative to the wall: her darshans tile the inside of a dome you turn by dragging, and tapping one lifts it out to fill the screen. Images are shown whole inside each tile."
        bleed
      >
        <DomeDarshan images={images} />
      </ShowcaseSection>

      <ShowcaseSection
        index={4}
        technique="Variable-font pressure · React Bits TextPressure + ScrollFloat"
        title="Her name, felt"
        description="MAHAKALI across the full width. Move your cursor along it and each letter swells in weight and width, as if breathing. Below, a line that rises letter by letter as you scroll. On phones the name stays still."
        bleed
      >
        <KineticName />
      </ShowcaseSection>

      <ShowcaseSection
        index={5}
        technique="Editorial chrome · bracket labels · file captions · grain · edge blur"
        title="The details that make it not basic"
        description="One homepage-style section wearing Click to Keep's details: labels in square brackets, file-name captions under each darshan, a faint film grain, an oversized heading with one serif word, and edges that blur away as you swipe the strip."
        bleed
      >
        <EditorialChrome images={images} />
      </ShowcaseSection>

      <SiteFooter />
    </div>
  );
}
