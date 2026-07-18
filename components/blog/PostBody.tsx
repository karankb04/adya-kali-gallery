import { PostBlock } from "@/types/post";
import RImage from "../RImage";

/** Renders the typed content blocks of a katha into the reading view. */
export default function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="k-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "paragraph":
            return (
              <p key={i} className={b.dropcap ? "k-p k-dropcap" : "k-p"}>
                {b.text}
              </p>
            );
          case "heading":
            return (
              <h2 key={i} className="k-h2">
                {b.text}
              </h2>
            );
          case "verse":
            return (
              <figure key={i} className="k-verse">
                <div className="k-verse-deva">{b.deva}</div>
                {b.translit && (
                  <div className="k-verse-translit">{b.translit}</div>
                )}
                <div className="k-verse-render">{b.rendering}</div>
                {b.source && (
                  <figcaption className="k-verse-src">{b.source}</figcaption>
                )}
              </figure>
            );
          case "quote":
            return (
              <blockquote key={i} className="k-quote">
                <p>{b.text}</p>
                {b.attribution && <cite>{b.attribution}</cite>}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="k-img">
                <RImage
                  r2Key={b.r2Key}
                  alt={b.alt}
                  width={b.width}
                  height={b.height}
                  dominantColor={b.dominantColor}
                  sizes="(max-width:760px) 92vw, 680px"
                  style={{ width: "100%", height: "auto" }}
                />
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          case "list":
            return (
              <ul key={i} className="k-list">
                {b.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
