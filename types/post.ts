// ---- Katha (blog) content model ----
// Posts are authored as typed blocks (no markdown pipeline) so each reading
// view can be art-directed precisely while staying plain data.

export type PostBlock =
  | { type: "paragraph"; text: string; dropcap?: boolean }
  | { type: "heading"; text: string }
  | {
      /** Sanskrit verse: Devanagari, transliteration, and a rendering. */
      type: "verse";
      deva: string;
      translit?: string;
      rendering: string;
      source?: string;
    }
  | { type: "quote"; text: string; attribution?: string }
  | {
      /** Inline image. r2Key reuses gallery assets in the R2 bucket. */
      type: "image";
      r2Key: string;
      caption?: string;
      alt: string;
      width?: number;
      height?: number;
      dominantColor?: string;
    }
  | { type: "list"; items: string[] };

export interface Post {
  slug: string;
  title: string;
  /** Devanagari epigraph shown above the title. */
  deva?: string;
  /** One-line dek shown under the title and on cards. */
  dek: string;
  /** Category label, e.g. "Iconography", "Festival", "Scripture". */
  kind: string;
  /** ISO date. */
  date: string;
  /** Reading time in minutes (hand-set). */
  minutes: number;
  /** Cover image: R2 key from the gallery bucket. */
  cover: {
    r2Key: string;
    alt: string;
    width?: number;
    height?: number;
    dominantColor?: string;
  };
  /** Gallery `form` values this katha relates to (drives the darshan strip). */
  relatedForms: string[];
  /** Topical tags — used for related-katha matching + SEO keywords. */
  tags: string[];
  blocks: PostBlock[];
}
