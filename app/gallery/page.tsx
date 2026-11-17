import type { Metadata } from "next";
import { getImages } from "@/lib/images";
import { buildGalleryJsonLd, SITE_URL, SITE_NAME, serializeJsonLd } from "@/lib/seo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GalleryLibrary from "@/components/GalleryLibrary";
import HomeRibbon from "@/components/HomeRibbon";
import FaqSection from "@/components/FaqSection";
import { GALLERY_FAQS } from "@/content/faqs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery: Every Face of the Mother",
  description:
    "The full gallery of Maa Adya Kali. Search and filter every form and darshan, and download them free.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/gallery`,
    siteName: SITE_NAME,
    title: "Gallery: Every Face of the Mother",
    description:
      "The full gallery of Maa Adya Kali. Search and filter every form and darshan.",
  },
};

export default async function GalleryPage() {
  const images = await getImages();
  const jsonLd = buildGalleryJsonLd(images, `${SITE_URL}/gallery`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />
      <main>
      <section className="gallery-hero">
        <div className="wrap">
          <h1>
            The <em className="it">gallery</em>
          </h1>
          <p className="gallery-hero-dek">
            Every face of the Mother in one place. Search her names, filter
            her forms, and take her home.
          </p>
        </div>
      </section>
      <HomeRibbon tone="yellow" />
      <GalleryLibrary images={images} />
      <FaqSection
        deva="Questions"
        title="Questions about the gallery"
        sub="How to search, filter, and download her darshan."
        items={GALLERY_FAQS}
      />
      </main>
      <SiteFooter />
    </>
  );
}
