import images from "@/data/images.json";
import { KaliImage } from "@/types/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";

export default function Home() {
  const data = images as KaliImage[];
  return (
    <>
      <Header />
      <Hero images={data} />
      <Gallery images={data} />
      <footer className="text-center py-10 text-ink-soft text-sm border-t border-line mt-10">
        <p>ॐ क्रीं काल्यै नमः &nbsp;·&nbsp; Adya Kali Gallery</p>
      </footer>
    </>
  );
}
