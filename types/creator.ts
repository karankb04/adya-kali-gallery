// ---- Creator profile content model ----
// One page per person behind the music, katha, or AI-envisioned art on the
// site — musicians, writers, and digital artists share this same shape.

export interface CreatorFact {
  label: string;
  value: string;
  emoji?: string;
}

export interface CreatorWork {
  title: string;
  /** Short tag shown on the card, e.g. "Music", "Katha", "Digital art". */
  kind: string;
  href: string;
  /** Gallery r2Key reused as a placeholder thumbnail until real art exists. */
  thumbnailR2Key?: string;
  thumbnailDominantColor?: string;
}

export interface Creator {
  slug: string;
  name: string;
  /** Short role/title shown under the name, e.g. "Music Composer & Vocalist". */
  role: string;
  category: "music" | "writer" | "artist";
  /** Answer to "what's your favourite seva/activity" — shown as a pull-quote. */
  favoriteSeva: string;
  bio: string;
  facts: CreatorFact[];
  worksHeading: string;
  works: CreatorWork[];
}
