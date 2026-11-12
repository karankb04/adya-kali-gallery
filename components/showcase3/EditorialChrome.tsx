import { KaliImage } from "@/types/image";
import RImage from "@/components/RImage";
import GradualBlur from "@/components/reactbits/GradualBlur";
import { panelSize } from "@/lib/arc";

/** "Dakshina Kali", index 2 → "DAKSHINA_KALI_03.JPG": Click to Keep's file-name captions. */
function fileName(img: KaliImage, i: number): string {
  return `${img.form.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_${String(i + 1).padStart(2, "0")}.JPG`;
}

/**
 * One homepage-style section wearing Click to Keep's details: bracket labels,
 * file-name captions, film grain, an oversized grotesk heading with a serif
 * accent, and edges that blur away as the strip scrolls under them.
 */
export default function EditorialChrome({ images }: { images: KaliImage[] }) {
  const strip = images.slice(0, 8);
  return (
    <section className="s3-ed">
      <div className="s3-ed-head">
        <span className="s3-ed-label">[ Darshan ]</span>
        <h3 className="s3-ed-title">
          Every face of the <em>Mother</em>
        </h3>
        <span className="s3-ed-label s3-ed-count">[ {String(images.length).padStart(2, "0")} forms ]</span>
      </div>

      <div className="s3-ed-strip-wrap">
        <div className="s3-ed-strip">
          {strip.map((img, i) => {
            const { width, height } = panelSize(img, 360);
            return (
              <figure key={img.id} className="s3-ed-card" style={{ width }}>
                <div className="s3-ed-media" style={{ height }}>
                  <RImage
                    r2Key={img.r2Key}
                    alt={img.altText ?? img.transliteration}
                    fill
                    sizes={`${Math.round(width)}px`}
                    dominantColor={img.dominantColor}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <figcaption className="s3-ed-file">{fileName(img, i)}</figcaption>
              </figure>
            );
          })}
        </div>
        <GradualBlur position="left" width="7rem" height="100%" strength={2} />
        <GradualBlur position="right" width="7rem" height="100%" strength={2} />
      </div>

      <div className="s3-ed-foot">
        <span className="s3-ed-label">[ Katha ]</span>
        <p>
          Stories, verses and the meaning behind each form, written for devotees and the
          curious alike.
        </p>
      </div>
    </section>
  );
}
