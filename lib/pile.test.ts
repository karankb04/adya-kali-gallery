import { test } from "node:test";
import assert from "node:assert/strict";
import { pileLayout, readCount, writeCount } from "./pile";

const AREA = { w: 800, h: 500 };

test("pileLayout is deterministic", () => {
  assert.deepEqual(pileLayout(12, 7, AREA), pileLayout(12, 7, AREA));
});

test("pileLayout returns one card per item", () => {
  assert.equal(pileLayout(12, 7, AREA).length, 12);
  assert.equal(pileLayout(0, 7, AREA).length, 0);
});

test("pileLayout stays inside the area", () => {
  for (const c of pileLayout(40, 3, AREA)) {
    assert.ok(c.x >= 0 && c.x <= AREA.w, `x ${c.x}`);
    assert.ok(c.y >= 0 && c.y <= AREA.h, `y ${c.y}`);
  }
});

test("pileLayout rotation is gentle", () => {
  for (const c of pileLayout(40, 3, AREA)) assert.ok(c.rotate >= -12 && c.rotate <= 12, `rotate ${c.rotate}`);
});

test("readCount survives a throwing storage", () => {
  const storage = { getItem: () => { throw new Error("SecurityError"); } };
  assert.equal(readCount(storage), 0);
  assert.equal(readCount(null), 0);
});

test("readCount rejects junk", () => {
  assert.equal(readCount({ getItem: () => "abc" }), 0);
  assert.equal(readCount({ getItem: () => "-3" }), 0);
  assert.equal(readCount({ getItem: () => null }), 0);
  assert.equal(readCount({ getItem: () => "14" }), 14);
});

test("writeCount never throws and stores under adya-pranams", () => {
  const seen: [string, string][] = [];
  writeCount({ setItem: (k: string, v: string) => void seen.push([k, v]) }, 5);
  assert.deepEqual(seen, [["adya-pranams", "5"]]);
  assert.doesNotThrow(() => writeCount({ setItem: () => { throw new Error("QuotaExceeded"); } }, 1));
  assert.doesNotThrow(() => writeCount(null, 1));
});
