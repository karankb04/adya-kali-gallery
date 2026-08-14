import RImage from "../RImage";
import { sample } from "./sampleData";

/** Pure CSS: position:sticky cards pin at incrementing offsets via a --i custom property. No scroll library. */
export default function StackingForms() {
  const forms = sample(5);
  return (
    <div className="sc-stack">
      {forms.map((f, i) => (
        <div key={f.id} className="sc-stack-card" style={{ "--i": i } as React.CSSProperties}>
          <div className="sc-stack-img">
            <RImage
              r2Key={f.r2Key}
              alt={f.transliteration}
              width={f.width}
              height={f.height}
              dominantColor={f.dominantColor}
              sizes="(max-width:760px) 90vw, 420px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="sc-stack-meta">
            <span className="sc-stack-deva">{f.nameDevanagari}</span>
            <h3>{f.transliteration}</h3>
            <p>{f.teachingCaption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
