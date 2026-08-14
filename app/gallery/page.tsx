import type { Metadata } from "next";
import { getImages } from "@/lib/images";
import { buildGalleryJsonLd, SITE_URL, SITE_NAME } from "@/lib/seo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GalleryLibrary from "@/components/GalleryLibrary";
import FaqSection from "@/components/FaqSection";
import { GALLERY_FAQS } from "@/content/faqs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery — Every Face of the Mother",
  description:
    "The full living gallery of Maa Adya Kali — every form, every darshan, searchable and filterable. Free to browse and download.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/gallery`,
    siteName: SITE_NAME,
    title: "Gallery — Every Face of the Mother",
    description:
      "The full living gallery of Maa Adya Kali — every form, every darshan, searchable and filterable.",
  },
};

export default async function GalleryPage() {
  const images = await getImages();
  const jsonLd = buildGalleryJsonLd(images, `${SITE_URL}/gallery`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader variant="page" />
      <section className="gallery-hero">
        <div className="wrap">
          <div className="gallery-hero-deva">काली दर्शन</div>
          <h1>The Gallery</h1>
          <p className="gallery-hero-dek">
            Every face of the Mother gathered in one place — search her
            names, filter her forms, and take her home.
          </p>
        </div>
      </section>
      <GalleryLibrary images={images} />
      <FaqSection
        deva="प्रश्न"
        title="Questions about the gallery"
        sub="How to search, filter, and download her darshan."
        items={GALLERY_FAQS}
      />
      <SiteFooter />
    </>
  );
}
