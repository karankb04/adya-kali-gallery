import type { Metadata } from "next";
import "../components/showcase.css";
import "./showcase2.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShowcaseSection from "@/components/showcase/ShowcaseSection";
import DiyaLight from "@/components/showcase2/DiyaLight";
import TempleDoors from "@/components/showcase2/TempleDoors";
import MantraReveal from "@/components/showcase2/MantraReveal";
import AmbientWash from "@/components/showcase2/AmbientWash";
import JapaMala from "@/components/showcase2/JapaMala";
import IncenseSmoke from "@/components/showcase2/IncenseSmoke";
import DarshanOfTheDay from "@/components/showcase2/DarshanOfTheDay";
import ViewTransitionGallery from "@/components/showcase2/ViewTransitionGallery";
import DevanagariSpecimen from "@/components/showcase2/DevanagariSpecimen";
import UxProposals from "@/components/showcase2/UxProposals";
import NavTypeSpecimen from "@/components/showcase2/NavTypeSpecimen";

// Internal proposals page — not linked from site nav, not indexed.
export const metadata: Metadata = {
  title: "Component Proposals II",
  robots: { index: false, follow: false },
};

// Darshan of the Day rolls over without a redeploy.
export const revalidate = 3600;

export default function ComponentsTwo() {
  return (
    <div className="sc-page">
      <SiteHeader />

      <header className="s2-intro">
        <p className="s2-intro-deva">दर्शन</p>
        <h1>Proposals for her</h1>
        <p className="s2-intro-dek">
          Eleven ideas built around one goal: that a visitor feels her presence,
          not just sees her pictures. Each lists what it costs the page, since
          search ranking depends on staying fast. None adds a new library.
        </p>
      </header>

      <ShowcaseSection
        index={1}
        technique="Lamplight reveal · CSS radial mask · ~1 KB"
        title="A diya held up to her darshan"
        description="She waits in near darkness; a warm pool of lamplight follows your pointer, like holding a diya before the murti. On phones the lamp drifts on its own in a slow aarti figure-eight. Runs only while on screen."
      >
        <DiyaLight />
      </ShowcaseSection>

      <ShowcaseSection
        index={2}
        technique="Sanctum doors · GSAP pin + scrub · CSS-only doors"
        title="The doors of the sanctum open"
        description="Scrolling swings the temple doors open on their hinges and you step into darshan. The doors are drawn in CSS, so the only download is her image. Strongest as a homepage or About opener."
        bleed
      >
        <TempleDoors />
      </ShowcaseSection>

      <ShowcaseSection
        index={3}
        technique="Grapheme-aware text reveal · Intl.Segmenter"
        title="Her name, written in light"
        description="The mantra resolves syllable by syllable out of a soft blur. It splits by grapheme cluster, not by character; a naive split breaks माँ into pieces and shows dotted-circle glyphs, a bug most animation tutorials ship with."
      >
        <MantraReveal />
      </ShowcaseSection>

      <ShowcaseSection
        index={4}
        technique="Ambient colour wash · stored dominantColor"
        title="The room takes on her colour"
        description="As each darshan reaches the middle of the screen, the whole section is washed in that image's own colour. The colours are already stored per image, so this costs one CSS variable and nothing else."
        bleed
      >
        <AmbientWash />
      </ShowcaseSection>

      <ShowcaseSection
        index={5}
        technique="Interactive japa mala · single SVG · native button"
        title="Chant with her, bead by bead"
        description="108 beads. Each tap, click, or Space moves one, the way a thumb moves along a real mala; the 108th completes a round with a gentle phone buzz. An invitation to stay and do, not just look."
      >
        <JapaMala />
      </ShowcaseSection>

      <ShowcaseSection
        index={6}
        technique="Incense smoke · Canvas 2D · pauses off screen"
        title="Smoke that rises like prayer"
        description="Agarbatti smoke drifts up behind a heading. Capped resolution, stopped whenever it scrolls out of view, and switched off entirely for visitors who prefer reduced motion."
        bleed
      >
        <IncenseSmoke />
      </ShowcaseSection>

      <ShowcaseSection
        index={7}
        technique="Darshan of the Day · server-rendered · 0 KB JS"
        title="A new face of the Mother each day"
        description="Chosen by date, the same for everyone on a given day, and rolling over automatically. No client JavaScript at all, and search engines see the real image and words."
      >
        <DarshanOfTheDay />
      </ShowcaseSection>

      <ShowcaseSection
        index={8}
        technique="View Transitions API · native morph · focus-managed"
        title="A viewer the browser animates itself"
        description="Tap a thumbnail and the browser morphs it into the full darshan, with no animation library. It also shows correct keyboard handling: focus moves in, Escape closes, focus returns to where you were. Older browsers simply get an instant swap."
      >
        <ViewTransitionGallery />
      </ShowcaseSection>

      <ShowcaseSection
        index={9}
        technique="Devanagari type · subset-loaded faces"
        title="A script worthy of her name"
        description="The site's Devanagari is all in Mukta. Five alternatives, set in her own mantra, each loaded as a subset of only the characters shown: a few KB instead of 100 KB+ per font."
      >
        <DevanagariSpecimen />
      </ShowcaseSection>

      <ShowcaseSection
        index={10}
        technique="UX audit · ui-ux-pro-max · verified in code"
        title="What to change on the live site"
        description="Prioritised by impact. Each was checked against the actual code, not a generic checklist."
      >
        <UxProposals />
      </ShowcaseSection>

      <ShowcaseSection
        index={11}
        technique="Nav typography · six directions · buttons unchanged"
        title="A header worthy of her name"
        description="The wordmark and links set six ways, each in a full replica of the bar with the Donate and Mission buttons left exactly as they are. Hover the links to see each one's hover style. On the live site the wordmark hides below 1100px wide, so the links carry most of the effect."
        bleed
      >
        <NavTypeSpecimen />
      </ShowcaseSection>

      <SiteFooter />
    </div>
  );
}
