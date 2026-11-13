import { KaliImage } from "@/types/image";
import { downloadLink } from "@/lib/download";
import Ornament from "./Ornament";
import RImage from "./RImage";

/** Splits "Dakshina Kali" into a loud part and one gentle italic last word. */
function loudGentle(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return ["", name];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

/**
 * One darshan chosen by today's date, the same for every visitor that day,
 * a reason to come back tomorrow.
 *
 * A server component: the pick happens at render time and the homepage
 * revalidates on its own, so it rolls over daily with no client JavaScript,
 * and search engines see the real image, names and teaching in the HTML.
 *
 * `variant="home2"` is the redesigned homepage look (italic-word heading,
 * English kicker, download button); the default stays as it was.
 */
export default function DarshanOfTheDay({
  images,
  variant,
}: {
  images: KaliImage[];
  variant?: "home2";
}) {
  if (!images.length) return null;
  const now = new Date();
  const day = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000
  );
  const img = images[day % images.length];
  const date = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
  const home2 = variant === "home2";
  const [loud, gentle] = loudGentle(img.form);
  const dl = downloadLink(img);

  return (
    <section className="dotd wrap" aria-labelledby="dotd-title">
      <div className="lib-head fade-up">
        {home2 ? <div className="kick">Jai Maa</div> : <Ornament className="lib-orn" />}
        <h2 id="dotd-title">
          {home2 ? (
            <>
              Today&apos;s <em className="it">darshan</em>
            </>
          ) : (
            "Today's darshan"
          )}
        </h2>
        <div className="sub">A new face of the Mother each day · {date}</div>
      </div>
      <article className="dotd-card fade-up">
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
          {home2 ? (
            <>
              <h3 className="dotd-title">
                {loud} <em className="it">{gentle}</em>
              </h3>
              <p className="dotd-form">{img.transliteration}</p>
            </>
          ) : (
            <>
              <h3 className="dotd-title">{img.transliteration}</h3>
              <p className="dotd-form">{img.form}</p>
            </>
          )}
          <p className="dotd-teach">{img.teachingCaption}</p>
          {home2 && (
            <a className="pill pill-ink" href={dl.href} download={dl.filename}>
              Download darshan
              <span className="pill-ar" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                  <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          )}
        </div>
      </article>
    </section>
  );
}
