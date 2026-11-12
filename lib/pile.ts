/** Small seeded PRNG so the heap looks the same on server and client. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Where each card lands in the offering heap: centres within the area,
 * gathered toward the middle and the floor like flowers laid at her feet,
 * each turned a little. Same inputs, same heap.
 */
export function pileLayout(
  count: number,
  seed: number,
  area: { w: number; h: number }
): { x: number; y: number; rotate: number; scale: number }[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    // Averaging two draws clusters cards toward the centre.
    const x = ((rand() + rand()) / 2) * area.w;
    // Squaring biases the height toward the floor, so the heap rests there.
    const r = rand();
    const y = area.h * (1 - r * r * 0.7);
    return { x, y, rotate: (rand() * 2 - 1) * 12, scale: 0.85 + rand() * 0.3 };
  });
}

const KEY = "adya-pranams";

/** The visitor's pranam count; 0 for missing, junk, or blocked storage. */
export function readCount(storage: Pick<Storage, "getItem"> | null): number {
  try {
    const n = Number(storage?.getItem(KEY));
    return Number.isInteger(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** Saves the count; private browsing or a full quota is silently ignored. */
export function writeCount(storage: Pick<Storage, "setItem"> | null, n: number): void {
  try {
    storage?.setItem(KEY, String(n));
  } catch {
    // Storage unavailable: the count just won't persist.
  }
}
