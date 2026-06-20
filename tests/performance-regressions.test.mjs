import test from "node:test";
import assert from "node:assert/strict";

import {
  NM,
  SIDE,
  createScenario,
  moveShips,
  scanSensors,
  shareTracks,
  stepSim,
  SCENARIO_MODE,
  trackForShip,
  ageTracks,
  currentTrack
} from "../src/sim.js";
import {
  firstLandCollisionFraction,
  projectLonLat
} from "../src/world/terrain.js";

test("radar track files contain hostile contacts, not friendly or self tracks", () => {
  const sim = createScenario(91);
  const blue = sim.ships[0];
  const red = sim.ships[1];
  const blueTwo = structuredClone({ ...blue, tracks: undefined });
  blueTwo.id = "DDG-BLUE-2";
  blueTwo.x = blue.x + NM;
  blueTwo.tracks = new Map();
  blueTwo.radarCooldown = 0;
  sim.ships.push(blueTwo);
  blue.radarCooldown = 0;
  red.radarCooldown = 0;

  scanSensors(sim, 0.25);

  assert.equal(blue.tracks.has(blueTwo.id), false);
  assert.equal(blueTwo.tracks.has(blue.id), false);
  assert.equal(blue.tracks.has(blue.id), false);
});

test("CEC sharing does not transitively relay a track during the same update", () => {
  const sim = createScenario(92);
  const blueOne = sim.ships[0];
  const red = sim.ships[1];
  const blueTwo = { ...blueOne, id: "BLUE-2", tracks: new Map() };
  const blueThree = { ...blueOne, id: "BLUE-3", tracks: new Map() };
  sim.ships.splice(1, 0, blueTwo, blueThree);
  sim.time = 10;
  blueOne.tracks.set(red.id, {
    id: red.id,
    side: red.side,
    classification: red.className,
    x: red.x,
    y: red.y,
    vx: 0,
    vy: 0,
    quality: 0.8,
    uncertainty: 500,
    source: blueOne.id,
    age: 3,
    lastSeen: 7
  });

  shareTracks(sim);

  assert.equal(trackForShip(sim, blueTwo, red.id)?.source, `${blueOne.id} datalink`);
  assert.equal(trackForShip(sim, blueThree, red.id)?.source, `${blueOne.id} datalink`);
  assert.equal(blueTwo.tracks.has(red.id), false, "shared reports are not copied into receiver-local maps");
});

test("blocked navigation plans reuse their detour during the cache window", () => {
  const sim = createScenario(93, "eastChinaSea");
  const ship = sim.ships[0];
  Object.assign(ship, projectLonLat(122.3, 30.9));
  ship.waypoint = projectLonLat(121.47, 31.23);

  moveShips(sim, 0.25);
  const plannedAt = ship.navPlan.plannedAt;
  const detour = ship.navigationWaypoint;
  sim.time += 0.25;
  moveShips(sim, 0.25);

  assert.equal(ship.navPlan.plannedAt, plannedAt);
  assert.deepEqual(ship.navigationWaypoint, detour);
});

test("terrain collision fraction returns the first of multiple land crossings", () => {
  const square = (left, right) => [
    [left, -2],
    [right, -2],
    [right, 2],
    [left, 2],
    [left, -2]
  ];
  const map = { landRings: [square(-6, -4), square(4, 6)], coastlines: [] };
  const fraction = firstLandCollisionFraction({ x: -10, y: 0 }, { x: 10, y: 0 }, map, 0);

  assert.ok(fraction > 0.19 && fraction < 0.21, `expected first crossing near 0.2, got ${fraction}`);
});

test("force-picture extrapolation uses the conservative half-second cadence", () => {
  const sim = createScenario(94);
  for (const ship of sim.ships) ship.radarActive = false;
  sim.mode = SCENARIO_MODE.RUNNING;
  sim.paused = false;

  stepSim(sim, 0.25);
  const firstPicture = sim.forcePicture;
  stepSim(sim, 0.25);
  assert.equal(sim.forcePicture, firstPicture);
  stepSim(sim, 0.25);
  assert.notEqual(sim.forcePicture, firstPicture);
});

test("track aging is lazy and materializes the same linear state on access", () => {
  const sim = createScenario(95);
  const blue = sim.ships[0];
  const red = sim.ships[1];
  blue.tracks.set(red.id, {
    id: red.id,
    side: red.side,
    x: 100,
    y: 200,
    vx: 10,
    vy: -4,
    quality: 0.8,
    uncertainty: 500,
    age: 0,
    lastSeen: 0
  });
  sim.time = 2;
  ageTracks(sim, 2);
  const raw = blue.tracks.get(red.id);
  assert.equal(raw.x, 100);
  assert.equal(raw.quality, 0.8);
  const current = currentTrack(raw, sim.time);
  assert.equal(current.x, 120);
  assert.equal(current.y, 192);
  assert.ok(Math.abs(current.quality - 0.788) < 1e-9);
  assert.equal(current.uncertainty, 680);
});

test("entity indexes persist across ticks without membership changes", () => {
  const sim = createScenario(96);
  for (const ship of sim.ships) ship.radarActive = false;
  sim.mode = SCENARIO_MODE.RUNNING;
  sim.paused = false;
  stepSim(sim, 0.25);
  const shipIndex = sim._shipById;
  const targetIndex = sim._missilesByTarget;
  stepSim(sim, 0.25);
  assert.equal(sim._shipById, shipIndex);
  assert.equal(sim._missilesByTarget, targetIndex);
});
