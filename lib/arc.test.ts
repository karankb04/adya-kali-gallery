import { test } from "node:test";
import assert from "node:assert/strict";
import { panelSize, arcTransform } from "./arc";

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
  assert.deepEqual(arcTransform(500, 1000), { rotateY: -35, translateZ: 225 });
  assert.deepEqual(arcTransform(-500, 1000), { rotateY: 35, translateZ: 225 });
});
