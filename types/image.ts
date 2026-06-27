export interface KaliImage {
  id: string;
  /** Devanagari name, e.g. "आद्या काली" */
  nameDevanagari: string;
  /** IAST / Roman transliteration, e.g. "Ādyā Kālī" */
  transliteration: string;
  /** Iconographic form, e.g. "Dakshina Kali", "Bhadra Kali" */
  form: string;
  /** Short devotional caption shown in the darshan modal */
  teachingCaption: string;
  /** R2 object key (filename). Full URL = R2_BASE_URL + "/" + r2Key */
  r2Key: string;
  /** Whether this image was AI-generated */
  isAI: boolean;
  /** Aspect ratio hint for masonry layout (width / height) */
  aspectRatio?: number;
}
