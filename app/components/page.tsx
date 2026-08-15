import type { Metadata } from "next";
import "./showcase.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShowcaseSection from "@/components/showcase/ShowcaseSection";
import KineticHero from "@/components/showcase/KineticHero";
import RevealGrid from "@/components/showcase/RevealGrid";
import ParallaxPortrait from "@/components/showcase/ParallaxPortrait";
import StatCounters from "@/components/showcase/StatCounters";
import MantraMarquee from "@/components/showcase/MantraMarquee";
import PinnedTeaching from "@/components/showcase/PinnedTeaching";
import StackingForms from "@/components/showcase/StackingForms";
import FilterGrid from "@/components/showcase/FilterGrid";
import SnapCarousel from "@/components/showcase/SnapCarousel";
import ParallaxWall from "@/components/showcase/ParallaxWall";
import MagneticCursorDemo from "@/components/showcase/MagneticCursorDemo";
import TextScramble from "@/components/showcase/TextScramble";
import PeekPreviewList from "@/components/showcase/PeekPreviewList";
import DevelopCanvas from "@/components/showcase/DevelopCanvas";

// Internal decision-making page — not linked from site nav, not indexed.
export const metadata: Metadata = {
  title: "Component Reference",
  robots: { index: false, follow: false },
};

export default function ComponentsShowcase() {
  return (
    <div className="sc-page">
      <SiteHeader />

      <KineticHero />

      <ShowcaseSection
        index={1}
        technique="Scroll reveal · IntersectionObserver + stagger"
        title="Cards that arrive as you scroll"
        description="Each card fades and slides up the first time it crosses the viewport, staggered 90ms apart. Fire-once — it never re-triggers on scroll-back."
      >
        <RevealGrid />
      </ShowcaseSection>

      <ShowcaseSection
        index={2}
        technique="Parallax · animation-timeline: view()"
        title="A portrait that drifts as the page moves"
        description="Native CSS scroll-driven animation where supported (zero JS, runs on the compositor); a requestAnimationFrame loop steps in only where it isn't."
      >
        <ParallaxPortrait />
      </ShowcaseSection>

      <ShowcaseSection
        index={3}
        technique="Count-up · IntersectionObserver + easeOutCubic"
        title="Numbers that count themselves in"
        description="Fires once on first view, eases from 0 to the target over 1.8s. Good for a stats strip — darshan count, forms, devotees reached."
      >
        <StatCounters />
      </ShowcaseSection>

      <ShowcaseSection
        index={4}
        technique="Marquee · CSS keyframes, speed-normalized"
        title="An endless ribbon of her name"
        description="JS only clones content to fill the track and sets the duration from a px/second speed, so it scrolls at a constant visual speed regardless of content length. Pauses on hover."
        bleed
      >
        <MantraMarquee />
      </ShowcaseSection>

      <ShowcaseSection
        index={5}
        technique="Pin · GSAP ScrollTrigger (sticky fallback)"
        title="A teaching that holds its place"
        description="The left column pins in place while the list of forms scrolls past beside it — the reader never loses their spot. Falls back to plain CSS position:sticky under 1200px."
      >
        <PinnedTeaching />
      </ShowcaseSection>

      <ShowcaseSection
        index={6}
        technique="Stacking cards · position: sticky"
        title="Forms that stack as you pass them"
        description="Pure CSS — each card is sticky at a slightly deeper offset than the one before it, so they pile up like a stack of photographs as you scroll."
      >
        <StackingForms />
      </ShowcaseSection>

      <ShowcaseSection
        index={7}
        technique="Filter + FLIP · Element.animate()"
        title="Filtering that animates the reflow"
        description="Positions are measured before the filter changes and after, then the delta is played back as a native WAAPI animation — no layout library needed."
      >
        <FilterGrid />
      </ShowcaseSection>

      <ShowcaseSection
        index={8}
        technique="Carousel · scroll-snap-type"
        title="A native, no-library slider"
        description="The browser's own scroll-snap does the sliding; JS only adds the dots and prev/next buttons. Swipes natively on touch, no extra code required."
      >
        <SnapCarousel />
      </ShowcaseSection>

      <ShowcaseSection
        index={9}
        technique="Differential parallax · GSAP scrub"
        title="A wall that moves at seven different speeds"
        description="Each tile gets its own scrub range and easing curve from a fixed set, alternating direction — the sense of depth comes purely from that variance, not a special API."
        bleed
      >
        <ParallaxWall />
      </ShowcaseSection>

      <ShowcaseSection
        index={10}
        technique="Magnetic pull + custom cursor · lerp"
        title="Buttons that reach for the pointer"
        description="Both the pull and the cursor trail the pointer at a fixed 0.15 lerp ratio rather than snapping — that's what gives the soft, magnetic feel. Scoped to this zone only."
      >
        <MagneticCursorDemo />
      </ShowcaseSection>

      <ShowcaseSection
        index={11}
        technique="Text scramble · hover decrypt"
        title="Names that resolve out of static"
        description="On hover, the name dissolves into Devanagari noise and progressively locks back into place, left to right — a small, reverent flourish for a name."
      >
        <TextScramble />
      </ShowcaseSection>

      <ShowcaseSection
        index={12}
        technique="Peek preview · cursor-lerping swap"
        title="A list that shows its image beside the cursor"
        description="One floating preview element follows the pointer and swaps its image on row hover — useful for a dense list of names where a full grid would be too heavy."
      >
        <PeekPreviewList />
      </ShowcaseSection>

      <ShowcaseSection
        index={13}
        technique="Cursor-reactive reveal · Canvas 2D"
        title="Her darshan develops as you draw near"
        description="A blocked, pixelated portrait sharpens in a soft radius around the cursor — like watching a photograph develop. No pixel read-back, so it works with any image."
      >
        <DevelopCanvas />
      </ShowcaseSection>

      <SiteFooter />
    </div>
  );
}
