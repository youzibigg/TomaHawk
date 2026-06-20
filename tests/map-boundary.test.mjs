import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createScenario } from "../src/sim.js";
import {
  CORE_MAP_HEIGHT_M,
  CORE_MAP_WIDTH_M,
  MAP_HEIGHT_M,
  MAP_WIDTH_M,
  TACTICAL_MAPS
} from "../src/ui/maps.js";

test("East China Sea world and coastline extent are four times the core map", () => {
  assert.equal(MAP_WIDTH_M, CORE_MAP_WIDTH_M * 4);
  assert.equal(MAP_HEIGHT_M, CORE_MAP_HEIGHT_M * 4);

  const extent = TACTICAL_MAPS.eastChinaSea.geographicExtent;
  assert.ok(Math.abs((extent.east - extent.west) - 54.4) < 1e-9);
  assert.ok(Math.abs((extent.north - extent.south) - 24) < 1e-9);

  const sim = createScenario(1);
  assert.equal(sim.widthM, MAP_WIDTH_M);
  assert.equal(sim.heightM, MAP_HEIGHT_M);
});

test("camera clamping uses the viewport-derived map scale", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  assert.match(appSource, /const minScale = minimumCameraScale\(\);/);
  assert.doesNotMatch(appSource, /\bMIN_CAMERA_SCALE\b/);
});

test("frame rendering preserves interactive panel DOM when content is unchanged", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  assert.match(appSource, /replaceHtmlIfChanged\(unitTab,/);
  assert.doesNotMatch(appSource, /unitTab\.innerHTML\s*=/);
});

test("tactical-map renders ships, tracks, and missiles without identifier text labels", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  assert.match(appSource, /shipDisplayName\(ship, "-"\)/);
  assert.doesNotMatch(appSource, /strokeText\(text, labelX, labelY\)/);
});

test("setup mode suppresses ship direction arrows until battle starts", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  assert.match(appSource, /sim\.mode !== SCENARIO_MODE\.SETUP && ship\.alive && \(ship\.speed > 0\.1 \|\| ship\.desiredSpeed > 0\.1\)/);
});

test("multi-selection radar rendering iterates every selected ship", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  assert.match(appSource, /for \(const ship of sim\.ships\) \{\s*if \(selectedIds\.has\(ship\.id\)\) drawSectorResponsibility\(ship\);\s*\}/s);
  assert.doesNotMatch(appSource, /drawSectorResponsibility\(focus\)/);
});

test("weapon range labels omit the numeric distance suffix", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  assert.doesNotMatch(appSource, /formatDistanceKm\(entry\.rangeM\)/);
  assert.match(appSource, /ctx\.fillText\(entry\.shortLabel, labelX, labelY\)/);
});

test("spawn section keeps only the tight button-group box", () => {
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /#left-rail \{[\s\S]*background: transparent;[\s\S]*border-color: transparent;[\s\S]*box-shadow: none;/);
  assert.match(styles, /\.spawn-tools \{[\s\S]*border: 1px solid rgba\(142, 193, 205, 0\.42\);/);
});
