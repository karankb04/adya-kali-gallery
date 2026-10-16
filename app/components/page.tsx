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
import HorizontalScroll from "@/components/showcase/HorizontalScroll";
import WordReveal from "@/components/showcase/WordReveal";
import VelocityMarquee from "@/components/showcase/VelocityMarquee";
import StickyChapters from "@/components/showcase/StickyChapters";
import CurtainReveal from "@/components/showcase/CurtainReveal";
import ExpandPanels from "@/components/showcase/ExpandPanels";
import RollingNumbers from "@/components/showcase/RollingNumbers";
import CircularBadge from "@/components/showcase/CircularBadge";
import TiltCards from "@/components/showcase/TiltCards";
import TypeSpecimen from "@/components/showcase/TypeSpecimen";

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

      <ShowcaseSection
        index={15}
        technique="Horizontal scroll · GSAP pin + containerAnimation"
        title="Scrolling down moves the row sideways"
        description="The section pins and the track slides left by exactly its overflow width. Two rules matter: animate a child of the pinned element, never the pin itself, and keep ease:'none' or scroll and position stop matching 1:1. Falls back to native touch-scroll under 760px."
        bleed
      >
        <HorizontalScroll />
      </ShowcaseSection>

      <ShowcaseSection
        index={16}
        technique="Word-by-word scrub · GSAP stagger"
        title="A statement that writes itself in"
        description="Each word lifts out of a blurred, dimmed rest state as you scroll through the block. Words are split in JSX rather than by rewriting innerHTML, so React keeps ownership of the DOM."
      >
        <WordReveal />
      </ShowcaseSection>

      <ShowcaseSection
        index={17}
        technique="Scroll-velocity marquee · single rAF loop"
        title="A ribbon that follows how fast you scroll"
        description="Speeds up with scroll velocity, flips direction when you scroll back, and skews under acceleration before settling. One rAF loop owns a single x offset — no per-frame layout reads."
        bleed
      >
        <VelocityMarquee />
      </ShowcaseSection>

      <ShowcaseSection
        index={18}
        technique="Sticky media + IntersectionObserver"
        title="One image, four chapters"
        description="The image column holds with position:sticky while the text scrolls; a thin observer band across mid-viewport decides which chapter is current and cross-fades the art. Cheaper and less brittle than measuring scroll offsets."
      >
        <StickyChapters />
      </ShowcaseSection>

      <ShowcaseSection
        index={19}
        technique="Curtain wipe · clip-path + counter-scale"
        title="A frame that opens on her"
        description="The frame widens via clip-path while the image inside counter-scales down. Without that counter-scale the image appears to grow with the frame and it reads as a zoom rather than an unveiling."
      >
        <CurtainReveal />
      </ShowcaseSection>

      <ShowcaseSection
        index={20}
        technique="Expanding panels · flex-grow transition"
        title="Panels that open where you point"
        description="Pure flex-grow — no measuring, no FLIP, smooth at any panel count. Labels sit vertical while collapsed and snap horizontal when open, which keeps the row readable at rest."
      >
        <ExpandPanels />
      </ShowcaseSection>

      <ShowcaseSection
        index={21}
        technique="Odometer · per-digit CSS reels"
        title="Numbers that roll into place"
        description="Each digit is its own 0–9 reel that slides to target with a staggered delay, so they land left to right. Different feel from a tweened count-up, which shows every number in between."
      >
        <RollingNumbers />
      </ShowcaseSection>

      <ShowcaseSection
        index={22}
        technique="Circular type · SVG textPath + scrub"
        title="A seal that turns as you pass"
        description="Text set on a circular path, with a slow idle spin in CSS and a second scroll-scrubbed rotation on a wrapper element — kept on separate nodes so neither fights the other for the transform."
      >
        <CircularBadge />
      </ShowcaseSection>

      <ShowcaseSection
        index={23}
        technique="3D tilt · CSS custom properties"
        title="Cards that lean toward the pointer"
        description="Pointer position is written to CSS variables and the transform lives in CSS, so it stays on the compositor and the mouse-leave reset is a plain transition instead of an unwinding JS animation. Writes are coalesced to one per frame."
      >
        <TiltCards />
      </ShowcaseSection>

      <ShowcaseSection
        index={24}
        technique="Type reference · candidate faces + treatments"
        title="Fonts and text styles to pull from"
        description="Six candidate faces beside the one in use, then six reusable text treatments — outline mixes, kicker pairings, oversized numerals, drop caps. These faces load only on this page; the live site is untouched."
      >
        <TypeSpecimen />
      </ShowcaseSection>

      <SiteFooter />
    </div>
  );
}
