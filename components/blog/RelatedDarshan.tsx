import { getImages } from "@/lib/images";
import RImage from "../RImage";

interface RelatedDarshanProps {
  /** Gallery `form` values to pull darshan for. */
  forms: string[];
  limit?: number;
}

/**
 * Server component: a strip of gallery images whose form matches the katha.
 * Links into the library with the form filter preselected.
 */
export default async function RelatedDarshan({
  forms,
  limit = 6,
}: RelatedDarshanProps) {
  const images = await getImages();
  const matching = images.filter((p) => forms.includes(p.form)).slice(0, limit);
  if (!matching.length) return null;

  return (
    <aside className="k-darshan">
      <div className="k-darshan-head">
        <h2>Her darshan</h2>
        <p>Images of the forms this katha speaks of, from the library.</p>
      </div>
      <div className="k-darshan-strip">
        {matching.map((p) => (
          <a
            key={p.id}
            className="k-darshan-tile"
            href={`/gallery?form=${encodeURIComponent(p.form)}`}
            aria-label={`${p.transliteration} — ${p.form}, in the library`}
          >
            <RImage
              r2Key={p.r2Key}
              alt={p.altText ?? `${p.transliteration} — ${p.form}`}
              width={p.width}
              height={p.height}
              dominantColor={p.dominantColor}
              sizes="(max-width:760px) 40vw, 200px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span className="k-darshan-nm">{p.transliteration}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
