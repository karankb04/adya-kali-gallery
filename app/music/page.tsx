import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MusicGrid from "@/components/MusicGrid";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Chants, stotrams, and devotional music for Adya Kali — from the ADYAKALI MUSIC YouTube channel.",
  alternates: { canonical: "/music" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/music`,
    siteName: SITE_NAME,
    title: "Music — Maa Adya Kali Gallery",
    description:
      "Chants, stotrams, and devotional music for Adya Kali — from the ADYAKALI MUSIC YouTube channel.",
  },
};

export default function MusicPage() {
  return (
    <>
      <SiteHeader />
      <section className="gallery-hero">
        <div className="wrap">
          <div className="gallery-hero-deva">संगीत</div>
          <h1>Music</h1>
          <p className="gallery-hero-dek">
            Chants, stotrams, and devotional songs for the Mother — from the{" "}
            <a
              href="https://www.youtube.com/@ADYAKALIMUSIC_KPM"
              target="_blank"
              rel="noopener noreferrer"
            >
              ADYAKALI MUSIC
            </a>{" "}
            channel.
          </p>
        </div>
      </section>
      <div className="wrap music-wrap">
        <MusicGrid />
      </div>
      <SiteFooter />
    </>
  );
}
