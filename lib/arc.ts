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
