import images from "@/data/images.json";
import { KaliImage } from "@/types/image";
import KaliApp from "@/components/KaliApp";

export default function Home() {
  return <KaliApp images={images as KaliImage[]} />;
}
