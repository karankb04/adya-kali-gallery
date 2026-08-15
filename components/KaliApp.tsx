"use client";
import { useState } from "react";
import { KaliImage } from "@/types/image";
import Hero from "./Hero";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import GalleryLibrary from "./GalleryLibrary";
import InstagramFeed from "./InstagramFeed";
import PinnedTeaching from "./showcase/PinnedTeaching";
import ScrollTextLines from "./ScrollTextLines";
import FaqSection from "./FaqSection";
import { HOME_FAQS } from "@/content/faqs";

interface KaliAppProps {
  images: KaliImage[];
}

// The homepage shows a taste of the gallery, not the whole thing — full
// browsing lives at /gallery. ~27% fewer cards than today's full set (22),
// landing in the 20-30% reduction range asked for.
const HOME_PREVIEW_LIMIT = 16;

export default function KaliApp({ images }: KaliAppProps) {
  // Shared with GalleryLibrary so the Hero wall and the grid below open the
  // same darshan modal instead of two independent ones.
  const [selected, setSelected] = useState<KaliImage | null>(null);

  return (
    <>
      <SiteHeader />

      {/* ---------- HERO ---------- */}
      <Hero images={images} onOpen={setSelected} />

      {/* ---------- LIBRARY PREVIEW ---------- */}
      <GalleryLibrary
        images={images}
        limit={HOME_PREVIEW_LIMIT}
        showOpenGalleryButton
        id="library"
        selected={selected}
        onSelectChange={setSelected}
      />

      {/* ---------- INSTAGRAM ---------- */}
      <InstagramFeed />

      {/* ---------- PINNED TEACHING ---------- */}
      <section className="pin-teaching wrap">
        <PinnedTeaching />
      </section>

      {/* ---------- SCROLL TEXT LINES ---------- */}
      <ScrollTextLines />

      {/* ---------- FAQ ---------- */}
      <FaqSection
        deva="प्रश्न"
        title="Questions devotees ask"
        sub="Everything you might want to know about the gallery and the mission behind it."
        items={HOME_FAQS}
      />

      <SiteFooter />
    </>
  );
}
