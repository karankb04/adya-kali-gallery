import RImage from "../RImage";
import Reveal from "./Reveal";
import { sample } from "./sampleData";

/** Staggered fade + slide-up reveal, fire-once per card as it scrolls into view. */
export default function RevealGrid() {
  const images = sample(6).slice(0, 6);
  return (
    <div className="sc-rgrid">
      {images.map((img, i) => (
        <Reveal key={img.id} variant="up" delay={i * 90} className="sc-rgrid-item">
          <RImage
            r2Key={img.r2Key}
            alt={img.transliteration}
            width={img.width}
            height={img.height}
            dominantColor={img.dominantColor}
            sizes="(max-width:760px) 45vw, 220px"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span className="sc-rgrid-cap">{img.transliteration}</span>
        </Reveal>
      ))}
    </div>
  );
}
