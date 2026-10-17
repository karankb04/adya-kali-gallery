import { KaliImage } from "@/types/image";
import Ornament from "./Ornament";
import RImage from "./RImage";

/**
 * One darshan chosen by today's date, the same for every visitor that day,
 * a reason to come back tomorrow.
 *
 * A server component: the pick happens at render time and the homepage
 * revalidates on its own, so it rolls over daily with no client JavaScript,
 * and search engines see the real image, names and teaching in the HTML.
 */
export default function DarshanOfTheDay({ images }: { images: KaliImage[] }) {
  if (!images.length) return null;
  const now = new Date();
  const day = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000
  );
  const img = images[day % images.length];
  const date = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });

  return (
    <section className="dotd wrap" aria-labelledby="dotd-title">
      <div className="lib-head">
        <Ornament className="lib-orn" />
        <h2 id="dotd-title">Today&apos;s darshan</h2>
        <div className="sub">A new face of the Mother each day · {date}</div>
      </div>
      <article className="dotd-card">
        <div className="dotd-media">
          <RImage
            r2Key={img.r2Key}
            alt={img.altText ?? `${img.transliteration} — ${img.form}`}
            width={img.width}
            height={img.height}
            dominantColor={img.dominantColor}
            sizes="(max-width:760px) 90vw, 420px"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="dotd-body">
          <p className="dotd-deva" lang="hi">{img.nameDevanagari}</p>
          <h3 className="dotd-title">{img.transliteration}</h3>
          <p className="dotd-form">{img.form}</p>
          <p className="dotd-teach">{img.teachingCaption}</p>
        </div>
      </article>
    </section>
  );
}
