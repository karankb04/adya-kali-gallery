export interface KaliImage {
  // ---- core identity ----
  id: string;
  /** R2 object key (filename). Full URL = R2_BASE_URL + "/" + r2Key */
  r2Key: string;
  /** Devanagari name, e.g. "आद्या काली" */
  nameDevanagari: string;
  /** IAST / Roman transliteration, e.g. "Ādyā Kālī" */
  transliteration: string;
  /** Iconographic form, e.g. "Dakshina Kali", "Bhadra Kali" */
  form: string;
  /** Short devotional caption shown in the darshan modal */
  teachingCaption: string;
  /** Whether this image was AI-generated */
  isAI: boolean;

  // ---- delivery / layout (prevents layout shift with next/image) ----
  /** Intrinsic pixel width */
  width?: number;
  /** Intrinsic pixel height */
  height?: number;
  /** Dominant color hex, used as a placeholder background while loading */
  dominantColor?: string;

  // ---- SEO / discovery ----
  /** Descriptive alt text (accessibility + image SEO). Falls back to a generated string. */
  altText?: string;
  /** URL-friendly slug (for future per-image pages + image sitemap). Auto-derived if absent. */
  slug?: string;
  /** Longer description for structured data / meta. */
  description?: string;
  /** Comma-separated topical keywords/tags. */
  tags?: string;
  /** Attribution / credit line (Google Images credit + structured data). */
  creditText?: string;
  /** Creator/author name. */
  creator?: string;
  /** License URL or short text (enables Google Images "Licensable" eligibility). */
  license?: string;
  /** Page where usage rights can be acquired (optional, for Licensable). */
  acquireLicensePage?: string;
  /** ISO date the image was created/published. */
  dateCreated?: string;
  /** Manual sort/priority (lower = earlier). */
  order?: number;
}
