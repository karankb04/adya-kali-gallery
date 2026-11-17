"use client";
import { useState } from "react";
import { KaliImage } from "@/types/image";
import Hero from "./Hero";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import GalleryLibrary from "./GalleryLibrary";
import HomeRibbon from "./HomeRibbon";
import MaaVideo from "./MaaVideo";
import SmoothScroll from "./SmoothScroll";
import FadeUp from "./FadeUp";

interface KaliAppProps {
  images: KaliImage[];
  /** Server-rendered Darshan of the Day, passed in so it stays zero-JS. */
  daily?: React.ReactNode;
}

// The homepage shows a taste of the gallery, not the whole thing — full
// browsing lives at /gallery. ~27% fewer cards than today's full set (22),
// landing in the 20-30% reduction range asked for.
const HOME_PREVIEW_LIMIT = 16;

/**
 * Homepage (redesign). Every section sits on a solid band:
 * image-heavy galleries on black, everything else on sindoor red, with the
 * yellow Maa video as the one poster moment. All home-only styling lives in
 * app/theme.css (shared by every page via the .site2 class on <body>).
 */
export default function KaliApp({ images, daily }: KaliAppProps) {
  // Shared with GalleryLibrary so the Hero wall and the grid below open the
  // same darshan modal instead of two independent ones.
  const [selected, setSelected] = useState<KaliImage | null>(null);

  return (
    <>
      <SmoothScroll />
      <SiteHeader />

      <main className="home">
        {/* ---------- HERO ---------- */}
        <Hero images={images} onOpen={setSelected} />

        {/* ---------- MANTRA RIBBON ---------- */}
        <HomeRibbon />

        {/* ---------- MAA VIDEO (yellow) ---------- */}
        <MaaVideo />

        {/* ---------- LIBRARY PREVIEW (black) ---------- */}
        <div className="band band-black">
          <GalleryLibrary
            images={images}
            limit={HOME_PREVIEW_LIMIT}
            showOpenGalleryButton
            id="library"
            selected={selected}
            onSelectChange={setSelected}
            kicker="The library"
            heading={
              <>
                Her <em className="it">faces</em>
              </>
            }
          />
        </div>

        {/* ---------- DARSHAN OF THE DAY (black, so it stands apart from the red footer) ---------- */}
        <div className="band band-black">{daily}</div>

      </main>

      <SiteFooter />
      <FadeUp />
    </>
  );
}
