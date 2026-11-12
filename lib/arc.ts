/**
 * Geometry for the Kargo-style curved gallery wall.
 *
 * Panels take the image's own shape so Maa's images are never cropped; a
 * landscape image is capped and letterboxed instead of stretching the wall.
 */
export function panelSize(
  img: { width?: number; height?: number },
  panelHeight: number,
  maxRatio = 0.9
): { width: number; height: number; letterbox: boolean } {
  const ratio = img.width && img.height ? img.width / img.height : 3 / 4;
  const letterbox = ratio > maxRatio;
  return { width: panelHeight * (letterbox ? maxRatio : ratio), height: panelHeight, letterbox };
}

/**
 * A concave wall, like standing inside a cylinder: panels turn to face the
 * centre and come closer the further they are from it. Kargo's measured
 * panels sit on a cylinder about 2.07 viewport widths in radius.
 */
export function arcTransform(
  offsetPx: number,
  viewportW: number,
  { radiusVw = 2.07 }: { radiusVw?: number } = {}
): { rotateY: number; translateZ: number } {
  const r = radiusVw * viewportW;
  const angle = offsetPx / r;
  // `|| 0` turns -0 into 0 at the centre.
  return { rotateY: (-angle * 180) / Math.PI || 0, translateZ: r * (1 - Math.cos(angle)) };
}

/**
 * Whether a click on the wall should be ignored because it ends a pointer
 * drag. Keyboard clicks (Enter/Space) arrive with `detail === 0` and always
 * go through, whatever the last drag was.
 */
export function shouldSuppressClick(movedPx: number, clickDetail: number): boolean {
  return clickDetail !== 0 && movedPx > 6;
}

/**
 * Whether a resize should rebuild the wall. Phone toolbars change the
 * height by a few percent while scrolling; only a width change or a height
 * change of 15% or more is a real layout change.
 */
export function needsRelayout(prev: { w: number; h: number }, next: { w: number; h: number }): boolean {
  return prev.w !== next.w || Math.abs(next.h - prev.h) / prev.h >= 0.15;
}
