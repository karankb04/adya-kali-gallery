"use client";
import { useState } from "react";
import { KaliImage } from "@/types/image";
import Hero from "./Hero";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import GalleryLibrary from "./GalleryLibrary";
import InstagramFeed from "./InstagramFeed";
import PinnedTeaching from "./showcase/PinnedTeaching";
import FaqSection from "./FaqSection";
import HomeRibbon from "./HomeRibbon";
import MaaVideo from "./MaaVideo";
import SmoothScroll from "./SmoothScroll";
import FadeUp from "./FadeUp";
import { HOME_FAQS } from "@/content/faqs";

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
 * Homepage, redesign pilot ("home2"). Every section sits on a solid band:
 * image-heavy galleries on black, everything else on sindoor red, with the
 * yellow Maa video as the one poster moment. All home-only styling lives in
 * app/home.css under the .home2 wrapper, so other pages are unaffected.
 */
export default function KaliApp({ images, daily }: KaliAppProps) {
  // Shared with GalleryLibrary so the Hero wall and the grid below open the
  // same darshan modal instead of two independent ones.
  const [selected, setSelected] = useState<KaliImage | null>(null);

  return (
    <>
      <SmoothScroll />
      <SiteHeader />

      <div className="home2">
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

        {/* ---------- DARSHAN OF THE DAY (red) ---------- */}
        <div className="band band-red">{daily}</div>

        {/* ---------- INSTAGRAM (black) ---------- */}
        <div className="band band-black">
          <InstagramFeed />
        </div>

        {/* ---------- PINNED TEACHING (red) ---------- */}
        <div className="band band-red">
          <section className="pin-teaching wrap">
            <PinnedTeaching
              kicker="Join the mission"
              heading={
                <>
                  Walk with <em className="it">her</em>
                </>
              }
              text="Nine ways to stay close to the mission — watch, listen, read, or join, whichever calls you."
            />
          </section>
        </div>

        {/* ---------- FAQ (black) ---------- */}
        <div className="band band-black">
          <FaqSection
            deva="Questions"
            title={
              <>
                Devotees <em className="it">ask</em>
              </>
            }
            sub="Everything you might want to know about the gallery and the mission behind it."
            items={HOME_FAQS}
          />
        </div>
      </div>

      <SiteFooter />
      <FadeUp />
    </>
  );
}
