import test from "node:test";
import assert from "node:assert/strict";
import { TACTICAL_MAPS, isLandPoint, tacticalMap } from "../src/ui/maps.js";

test("East China Sea map provides land polygons and open sea stays empty", () => {
  assert.ok(TACTICAL_MAPS.eastChinaSea.land.length >= 4);
  assert.equal(TACTICAL_MAPS.openSea.land.length, 0);
  assert.equal(tacticalMap("unknown"), TACTICAL_MAPS.openSea);
});

test("terrain framework can classify land without changing simulation movement", () => {
  const map = TACTICAL_MAPS.eastChinaSea;
  assert.equal(isLandPoint({ x: -250 * 1852, y: 0 }, map), true);
  assert.equal(isLandPoint({ x: 0, y: 0 }, map), false);
});
