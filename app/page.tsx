import { getImages } from "@/lib/images";
import { buildSiteJsonLd } from "@/lib/seo";
import KaliApp from "@/components/KaliApp";
import DarshanOfTheDay from "@/components/DarshanOfTheDay";

export const revalidate = 60;

export default async function Home() {
  const images = await getImages();
  const jsonLd = buildSiteJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KaliApp images={images} daily={<DarshanOfTheDay images={images} />} />
    </>
  );
}
