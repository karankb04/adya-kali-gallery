import { test } from "node:test";
import assert from "node:assert/strict";
import { panelSize, arcTransform, shouldSuppressClick, needsRelayout } from "./arc";

test("panelSize keeps the image's own aspect", () => {
  assert.deepEqual(panelSize({ width: 3000, height: 4000 }, 600), { width: 450, height: 600, letterbox: false });
});

test("panelSize falls back to 3:4", () => {
  assert.deepEqual(panelSize({}, 600), { width: 450, height: 600, letterbox: false });
});

test("panelSize caps landscape width", () => {
  assert.deepEqual(panelSize({ width: 1600, height: 900 }, 600), { width: 540, height: 600, letterbox: true });
});

test("arcTransform is flat at centre", () => {
  assert.deepEqual(arcTransform(0, 1000), { rotateY: 0, translateZ: 0 });
});

test("arcTransform is concave and symmetric", () => {
  const right = arcTransform(500, 1000);
  const left = arcTransform(-500, 1000);
  assert.equal(right.rotateY, -left.rotateY);
  assert.equal(right.translateZ, left.translateZ);
  assert.ok(left.rotateY > 0 && left.translateZ > 0);
});

test("arcTransform matches Kargo's measured cylinder", () => {
  // Measured on kargo-studio.com/works at a 1024px viewport.
  const near = arcTransform(-294, 1024);
  assert.ok(Math.abs(near.rotateY - 7.95) < 0.5, `near angle ${near.rotateY}`);
  assert.ok(Math.abs(near.translateZ - 20.1) < 3, `near depth ${near.translateZ}`);
  const far = arcTransform(-1216, 1024);
  assert.ok(Math.abs(far.rotateY - 32.9) < 1, `far angle ${far.rotateY}`);
  assert.ok(Math.abs(far.translateZ - 335) < 15, `far depth ${far.translateZ}`);
});

test("shouldSuppressClick ignores keyboard clicks after a drag", () => {
  // A keyboard Enter/Space click has detail 0 and must always go through.
  assert.equal(shouldSuppressClick(50, 0), false);
});

test("shouldSuppressClick swallows the click that ends a pointer drag", () => {
  assert.equal(shouldSuppressClick(50, 1), true);
  assert.equal(shouldSuppressClick(3, 1), false);
});

test("needsRelayout ignores a phone toolbar's small height change", () => {
  assert.equal(needsRelayout({ w: 390, h: 700 }, { w: 390, h: 640 }), false);
});

test("needsRelayout reacts to width changes and big height changes", () => {
  assert.equal(needsRelayout({ w: 390, h: 700 }, { w: 844, h: 390 }), true);
  assert.equal(needsRelayout({ w: 1440, h: 900 }, { w: 1440, h: 600 }), true);
});
