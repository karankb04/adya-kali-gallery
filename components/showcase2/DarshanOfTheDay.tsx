import RImage from "../RImage";
import { SAMPLE_IMAGES } from "../showcase/sampleData";

/**
 * One darshan chosen by today's date, the same for every visitor on a given
 * day. It gives people a reason to come back tomorrow.
 *
 * Server-rendered with no client JS: the pick happens at render time and the
 * page revalidates hourly, so it rolls over on its own. Search engines see
 * the real image, name and caption in the HTML.
 */
export default function DarshanOfTheDay() {
  const now = new Date();
  const dayNumber = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000);
  const img = SAMPLE_IMAGES[dayNumber % SAMPLE_IMAGES.length];
  const date = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });

  return (
    <article className="s2-dotd">
      <div className="s2-dotd-media">
        <RImage
          r2Key={img.r2Key}
          alt={`${img.transliteration} — ${img.form}`}
          width={img.width}
          height={img.height}
          dominantColor={img.dominantColor}
          sizes="(max-width:760px) 90vw, 420px"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="s2-dotd-body">
        <p className="s2-dotd-kicker">Today&apos;s darshan · {date}</p>
        <p className="s2-dotd-deva">{img.nameDevanagari}</p>
        <h3 className="s2-dotd-title">{img.transliteration}</h3>
        <p className="s2-dotd-teach">{img.teachingCaption}</p>
        <p className="s2-dotd-foot">A new face of the Mother each day</p>
      </div>
    </article>
  );
}
