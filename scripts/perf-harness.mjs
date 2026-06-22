// Shared performance-measurement harness for the simulation core.
//
// The goal is a *machine-independent* number that catches time-complexity
// regressions: if a change turns an O(n) loop into O(n^2), the cost of a tick
// stops scaling with the force size and starts scaling with its square.
//
// The trick is to measure the SAME machine at two force sizes and take the
// ratio. Absolute milliseconds depend on the CPU; the ratio does not. We also
// make the workload *sustained* — ships are made effectively unkillable with
// bottomless magazines — so the battle never ends early (which would let
// stepSim short-circuit and corrupt the timing) and the missile pressure that
// drives the hot loops stays representative for the whole measurement window.

import { createScenario, clearSide, placeShip, stepSim, SIDE, SCENARIO_MODE, NM } from "../src/sim.js";

const HULLS = ["DDG", "CCG", "FFG", "BBG"];

// Build a head-on engagement of `perSide` ships per side whose units cannot be
// sunk and never run dry, producing a steady-state combat workload.
export function buildSustainedBattle(seed, perSide) {
  const sim = createScenario(seed);
  clearSide(sim, SIDE.BLUE);
  clearSide(sim, SIDE.RED);
  for (let i = 0; i < perSide; i++) {
    const y = (i - perSide / 2) * 6 * NM;
    const blue = placeShip(sim, SIDE.BLUE, -42 * NM, y, HULLS[i % HULLS.length]);
    const red = placeShip(sim, SIDE.RED, 42 * NM, -y, HULLS[(i + 1) % HULLS.length]);
    for (const ship of [blue, red]) {
      ship.damageResist = 1e9;
      for (const key of Object.keys(ship.loadout)) ship.loadout[key] = 9999;
    }
  }
  sim.mode = SCENARIO_MODE.RUNNING;
  sim.paused = false;
  return sim;
}

// Median (over `runs` differently-seeded battles) milliseconds per tick at a
// given force size. A short warm-up run pays off JIT/allocation cost first.
export function medianMsPerTick(perSide, { ticks = 1000, runs = 3 } = {}) {
  const warm = buildSustainedBattle(99, perSide);
  for (let i = 0; i < 150; i++) stepSim(warm, 0.25);
  const samples = [];
  for (let run = 0; run < runs; run++) {
    const sim = buildSustainedBattle(7 + run, perSide);
    const start = process.hrtime.bigint();
    for (let i = 0; i < ticks; i++) stepSim(sim, 0.25);
    samples.push(Number(process.hrtime.bigint() - start) / 1e6 / ticks);
  }
  samples.sort((a, b) => a - b);
  return samples[Math.floor(samples.length / 2)];
}

// The headline number. Measures per-tick cost at a small and a large force size
// and normalizes the cost ratio by the size ratio:
//
//   score = (msLarge / msSmall) / (largePerSide / smallPerSide)
//
//   ~1.0  cost scales linearly with the number of units (ideal)
//    R    cost scales quadratically, where R = largePerSide / smallPerSide
//
// With the default 5x size step: 1.0 is linear, 5.0 is quadratic. The score is
// machine-independent because both measurements run on the same CPU.
export function complexityScore({ smallPerSide = 3, largePerSide = 15, ticks = 1000, runs = 3 } = {}) {
  const small = medianMsPerTick(smallPerSide, { ticks, runs });
  const large = medianMsPerTick(largePerSide, { ticks, runs });
  const sizeRatio = largePerSide / smallPerSide;
  return {
    score: (large / small) / sizeRatio,
    sizeRatio,
    small,
    large,
    smallShips: smallPerSide * 2,
    largeShips: largePerSide * 2,
    quadraticScore: sizeRatio
  };
}
