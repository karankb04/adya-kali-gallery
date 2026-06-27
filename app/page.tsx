import { getImages } from "@/lib/images";
import { buildJsonLd } from "@/lib/seo";
import KaliApp from "@/components/KaliApp";

export const revalidate = 60;

export default async function Home() {
  const images = await getImages();
  const jsonLd = buildJsonLd(images);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KaliApp images={images} />
    </>
  );
}
