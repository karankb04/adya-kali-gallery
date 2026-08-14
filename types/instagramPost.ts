export interface InstagramPost {
  id: string;
  /** Gallery R2 key reused as the post image. */
  r2Key: string;
  width?: number;
  height?: number;
  dominantColor?: string;
  caption: string;
  /** Display-only, static count (not live data). */
  likes: number;
  /** Relative label, e.g. "2d", "1w". */
  postedAgo: string;
  /** Link to the real Instagram post/profile. */
  permalink: string;
}
