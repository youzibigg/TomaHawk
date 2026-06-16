import test from "node:test";
import assert from "node:assert/strict";
import { createScenario, SIDE } from "../src/sim.js";
import {
  worldToScreen,
  screenToWorld,
  sideColor,
  sideSoftColor,
  shipHpState,
  vlsLoadState,
  displayCount,
  commandPosture,
  postureBar,
  renderBattleStatus,
  inventoryHeadHtml,
  inventoryRowHtml,
  inventoryHtml
} from "../src/ui/view.js";

const camera = { x: 1000, y: -500, scale: 0.0022 };
const viewW = 1280;
const viewH = 720;

test("worldToScreen and screenToWorld are exact inverses", () => {
  const p = { x: 42345, y: -98765 };
  const screen = worldToScreen(p, camera, viewW, viewH);
  const back = screenToWorld(screen.x, screen.y, camera, viewW, viewH);
  assert.ok(Math.abs(back.x - p.x) < 1e-6);
  assert.ok(Math.abs(back.y - p.y) < 1e-6);
});

test("worldToScreen places the camera focus at viewport center", () => {
  const screen = worldToScreen({ x: camera.x, y: camera.y }, camera, viewW, viewH);
  assert.equal(screen.x, viewW / 2);
  assert.equal(screen.y, viewH / 2);
});

test("side colors are distinct for blue and red", () => {
  assert.notEqual(sideColor(SIDE.BLUE), sideColor(SIDE.RED));
  assert.notEqual(sideSoftColor(SIDE.BLUE), sideSoftColor(SIDE.RED));
});

test("shipHpState derives current HP from damage and resist", () => {
  assert.deepEqual(shipHpState({ damageResist: 3, damage: 1 }), { currentHp: 2, maxHp: 3, damage: 1 });
  // HP never goes negative, max is at least 1
  assert.deepEqual(shipHpState({ damageResist: 1, damage: 5 }), { currentHp: 0, maxHp: 1, damage: 5 });
});

test("vlsLoadState reports a full default destroyer magazine", () => {
  const ship = createScenario(1).ships[0];
  const vls = vlsLoadState(ship);
  assert.equal(vls.cap, 96);
  assert.ok(vls.used <= vls.cap);
  assert.ok(vls.fill > 0 && vls.fill <= 1);
});

test("displayCount returns non-negative integers and tolerates junk", () => {
  assert.equal(displayCount({ loadout: { ESSM: 7.6 } }, "ESSM"), 8);
  assert.equal(displayCount({ loadout: {} }, "ESSM"), 0);
  assert.equal(displayCount({ loadout: { ESSM: -3 } }, "ESSM"), 0);
  assert.equal(displayCount(null, "ESSM"), 0);
});

test("commandPosture falls back to a neutral posture when none is computed", () => {
  const sim = createScenario(1);
  const posture = commandPosture(sim, SIDE.BLUE);
  assert.equal(posture.aggression, 0.5);
});

test("postureBar renders the aggression percentage and side class", () => {
  const html = postureBar(SIDE.RED, { aggression: 0.42 });
  assert.match(html, /42%/);
  assert.match(html, /posture-chip/);
  assert.match(html, /\bred\b/);
});

test("renderBattleStatus emits ship counts and both posture bars", () => {
  const sim = createScenario(3);
  const html = renderBattleStatus(sim);
  assert.match(html, /R HP/);
  assert.match(html, /B HP/);
  assert.match(html, /B AGG/);
  assert.match(html, /R AGG/);
});

test("inventory header exposes all eight tracked columns", () => {
  const head = inventoryHeadHtml();
  for (const col of ["SHIP", "HP", "VLS", "SM2", "SM6", "ESSM", "MSTK", "TLAM"]) {
    assert.match(head, new RegExp(`>${col}<`));
  }
});

test("inventory row is a selectable button carrying the ship id and HP/VLS cells", () => {
  const ship = createScenario(7).ships[0];
  const row = inventoryRowHtml(ship, true);
  assert.match(row, new RegExp(`data-select-ship="${ship.id}"`));
  assert.match(row, /class="inventory-row blue[^"]*selected"/);
  assert.match(row, /\/96</); // VLS capacity cell
});

test("inventoryHtml inserts a divider between sides and a row per ship", () => {
  const sim = createScenario(5);
  const ordered = [...sim.ships].sort((a, b) => a.side.localeCompare(b.side) || a.id.localeCompare(b.id));
  const html = inventoryHtml(ordered, () => false);
  const rows = (html.match(/inventory-row/g) || []).length;
  assert.equal(rows, sim.ships.length);
  assert.match(html, /inventory-divider/);
});
