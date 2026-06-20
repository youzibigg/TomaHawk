// Performance + determinism micro-benchmark for the simulation core.
//
//   npm run bench
//
// Reports sustained ticks/sec for a few battle sizes and verifies that two runs
// of the same seed produce byte-identical event streams (the determinism
// invariant the hot-path indexes must never break).

import { createScenario, clearSide, placeShip, stepSim, moveShips, SIDE, SCENARIO_MODE, NM } from "../src/sim.js";
import { projectLonLat } from "../src/world/terrain.js";

const HULLS = ["DDG", "CCG", "FFG", "BBG"];

function buildBattle(seed, perSide) {
  const sim = createScenario(seed);
  clearSide(sim, SIDE.BLUE);
  clearSide(sim, SIDE.RED);
  for (let i = 0; i < perSide; i++) {
    const y = (i - perSide / 2) * 6 * NM;
    placeShip(sim, SIDE.BLUE, -42 * NM, y, HULLS[i % HULLS.length]);
    placeShip(sim, SIDE.RED, 42 * NM, -y, HULLS[(i + 1) % HULLS.length]);
  }
  sim.mode = SCENARIO_MODE.RUNNING;
  sim.paused = false;
  return sim;
}

function eventDigest(sim) {
  return sim.events.map((e) => `${e.t.toFixed(2)}|${e.side}|${e.text}`).join("\n");
}

// --- determinism check ------------------------------------------------------
let determinismOk = true;
for (const seed of [1, 7, 23]) {
  const a = buildBattle(seed, 3);
  const b = buildBattle(seed, 3);
  for (let i = 0; i < 2400; i++) {
    stepSim(a, 0.25);
    stepSim(b, 0.25);
  }
  if (eventDigest(a) !== eventDigest(b)) {
    determinismOk = false;
    console.error(`  determinism FAILED for seed ${seed}`);
  }
}
console.log(`determinism (same seed -> identical events): ${determinismOk ? "OK" : "FAILED"}`);

// --- throughput -------------------------------------------------------------
console.log("\nthroughput (2400 ticks each):");
for (const perSide of [1, 2, 4, 8]) {
  const ships = perSide * 2;
  const ticks = 2400;
  // warm up so the first measured run is not paying JIT/allocation cost
  const warm = buildBattle(99, perSide);
  for (let i = 0; i < 200; i++) stepSim(warm, 0.25);

  const sim = buildBattle(7, perSide);
  const start = process.hrtime.bigint();
  for (let i = 0; i < ticks; i++) stepSim(sim, 0.25);
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  const tps = Math.round((ticks / elapsedMs) * 1000);
  console.log(
    `  ${String(ships).padStart(2)} ships: ${tps.toLocaleString().padStart(9)} ticks/s` +
    `  (${elapsedMs.toFixed(1)} ms, peak missiles ~${sim.missiles.length})`
  );
}

// --- terrain navigation ----------------------------------------------------
// The Open Sea throughput cases intentionally isolate combat scaling. This
// coastal case guards the terrain-aware movement path that previously caused
// recurring frame-length stalls while replanning a blocked route.
const coastal = createScenario(17, "eastChinaSea");
const coastalShip = coastal.ships[0];
Object.assign(coastalShip, projectLonLat(122.3, 30.9));
coastalShip.waypoint = projectLonLat(121.47, 31.23);
let start = process.hrtime.bigint();
moveShips(coastal, 0.25);
const firstRouteMs = Number(process.hrtime.bigint() - start) / 1e6;
start = process.hrtime.bigint();
for (let i = 0; i < 20; i++) {
  coastal.time += 0.25;
  moveShips(coastal, 0.25);
}
const cachedRouteMs = Number(process.hrtime.bigint() - start) / 1e6;
console.log("\nterrain navigation (East China Sea blocked route):");
console.log(`  first plan: ${firstRouteMs.toFixed(1)} ms`);
console.log(`  next 20 ticks: ${cachedRouteMs.toFixed(1)} ms (${(cachedRouteMs / 20).toFixed(2)} ms/tick)`);

process.exit(determinismOk ? 0 : 1);
