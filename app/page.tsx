import { getImages } from "@/lib/images";
import { buildSiteJsonLd, serializeJsonLd } from "@/lib/seo";
import KaliApp from "@/components/KaliApp";

export const revalidate = 60;

export default async function Home() {
  const images = await getImages();
  const jsonLd = buildSiteJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <KaliApp images={images} />
    </>
  );
}
