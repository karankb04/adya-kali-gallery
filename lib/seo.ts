import { KaliImage } from "@/types/image";
import { r2url } from "./r2";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://adya-kali-gallery-gg4i.vercel.app";

export const SITE_NAME = "Maa Adya Kali Gallery";

/** One Schema.org ImageObject per image (rich metadata for Google Images). */
export function imageObject(p: KaliImage) {
  const obj: Record<string, unknown> = {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#${p.slug || p.id}`,
    contentUrl: r2url(p.r2Key),
    name: `${p.transliteration} — ${p.form}`,
    caption: p.teachingCaption,
    description: p.description || p.teachingCaption,
    representativeOfPage: false,
  };
  if (p.width) obj.width = p.width;
  if (p.height) obj.height = p.height;
  if (p.tags) obj.keywords = p.tags;
  if (p.creator) obj.creator = { "@type": "Person", name: p.creator };
  if (p.creditText) obj.creditText = p.creditText;
  if (p.license) obj.license = p.license;
  if (p.acquireLicensePage) obj.acquireLicensePage = p.acquireLicensePage;
  if (p.dateCreated) obj.dateCreated = p.dateCreated;
  return obj;
}

/** Full JSON-LD graph for the gallery home page. */
export function buildJsonLd(images: KaliImage[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          "A living library of Maa Adya Kali — sacred images, her many forms, and teachings.",
        inLanguage: ["en", "hi", "sa"],
      },
      {
        "@type": "ImageGallery",
        "@id": `${SITE_URL}/#gallery`,
        url: SITE_URL,
        name: SITE_NAME,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: "Maa Adya Kali (Kali, the primordial Divine Mother)",
        numberOfItems: images.length,
        associatedMedia: images.map(imageObject),
      },
    ],
  };
}
