# `src/` layout

Source for the TomaHawk / 战斧 sandbox. No build step — these files are served
as-is and run as native ES modules in the browser and in Node.

## Files

- `app.js` — browser entry: canvas rendering, input, panels, sim controls.
- `world/map-spec.js` — shared map dimensions, projection center, and crop helpers used by terrain and data generation.
- `world/terrain.js` — shared tactical-map geometry and binary water/land
  queries, accelerated by conservative water-mask and ring/edge spatial grids.
- `ui/view.js` — **pure** presentation helpers (coordinate transforms, panel
  HTML builders, per-ship derived state). No DOM/canvas/global access, so it is
  unit-tested directly in `tests/ui.test.mjs`. `app.js` imports from here.
- `styles.css` — tactical UI layout and styling.
- `sim.js` — **barrel only**. Re-exports the simulation core from `sim/`.
  Consumers (`app.js`, `ui/`, tests) import from here; do not move logic into it.

## `sim/` — the simulation core (dependency order, low → high)

| Module | Owns |
| --- | --- |
| `constants.js` | units (`NM`, `KNOT`), side/role/mode enums, `VISUAL_CONFIG` |
| `math.js` | geometry, kinematics, `interceptPoint`, `Rng` |
| `events.js` | event-log append, severity, time formatting |
| `missiles.js` | `MISSILES` catalogue, display helpers, `battleSummaryCounts` |
| `ships.js` | `SHIP_CLASSES`, ship factory, loadout/ROE, hull-id counter |
| `sensors.js` | hostile radar detection, lazy track ageing/pruning, centralized CEC sharing, adaptive spatial scan index |
| `command.js` | fused force picture + fleet command posture (OTC/AAWC, modes) |
| `movement.js` | ship motion integration, terrain-aware detours, per-unit movement decisions |
| `combat.js` | launch queues, fire planning, missile flight, damage, CIWS |
| `scenario.js` | create/serialize/restore/export, map state, setup-mode editing |
| `step.js` | `stepSim` — the deterministic top-level tick |

## Conventions

- **Imports flow upward only.** A module imports from lower layers, never the
  reverse. Cross-references between functions in different modules are fine
  because they execute at runtime, after all modules load.
- **Add a new public symbol** → export it from its module, then add the module
  to the `export *` list in `sim.js` if it is a new file.
- **Where things go:** new missile → `missiles.js`; new hull → `ships.js`;
  new sensor/track rule → `sensors.js`; AI posture → `command.js`; weapon
  logic/guidance → `combat.js`; save-format field → `scenario.js`.
- **Keep it deterministic.** Same seed + inputs ⇒ same result. Route all
  randomness through `sim.rng` (the seeded `Rng`), never `Math.random()`.
- **Verify with `npm test`** after any change to `sim/` or `ui/`.
- **`npm run bench`** reports ticks/sec by battle size and re-checks determinism;
- **`npm run bench:frontend`** measures dense target lookup, label clustering,
  and stable inventory-frame work;
  CI (`.github/workflows/ci.yml`) runs `npm test` on every push/PR.
