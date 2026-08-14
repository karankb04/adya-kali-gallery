import localData from "@/data/images.json";
import { KaliImage } from "@/types/image";

/**
 * Shared placeholder content for the /components showcase — reuses the same
 * bundled gallery data everywhere on the real site, so the demo is judged
 * against actual Maa Kali imagery rather than lorem ipsum.
 */
export const SAMPLE_IMAGES = localData as KaliImage[];

export function sample(n = 10): KaliImage[] {
  return SAMPLE_IMAGES.slice(0, n);
}

export const MANTRA = "॥ जय माँ आद्या काली ॥";

export const STATS = [
  { value: 22, suffix: "", label: "Darshan in the library" },
  { value: 9, suffix: "", label: "Forms of the Mother" },
  { value: 4, suffix: "", label: "Katha published" },
  { value: 1000, suffix: "+", label: "Devotees reached" },
];
