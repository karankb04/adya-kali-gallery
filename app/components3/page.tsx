import type { Metadata } from "next";
import "../components/showcase.css";
import "../components2/showcase2.css";
import "./showcase3.css";
import { FONT_VARS } from "./fonts";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShowcaseSection from "@/components/showcase/ShowcaseSection";
import TypeSystems from "@/components/showcase3/TypeSystems";

// Internal proposals page — not linked from site nav, not indexed.
export const metadata: Metadata = {
  title: "Component Proposals III",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function ComponentsThree() {
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

      <SiteFooter />
    </div>
  );
}
