# AGENTS.md

## Purpose

Use this file to route yourself to the smallest relevant part of the repository first. Do **not** read the whole repo by default.

## Fast repo map

- `src/sim.js` — core simulation, doctrine, sensors, tracks, weapons, damage, serialization.
- `src/app.js` — canvas rendering, UI state, map interaction, controls, panels, save/load wiring.
- `src/styles.css` — layout and visual styling for the tactical UI.
- `index.html` — static UI shell and DOM ids used by `src/app.js`.
- `tests/sim.test.mjs` — behavior/regression tests; often the fastest way to learn intended rules.
- `server.mjs` — tiny static file server for local runs.
- `README.md` — high-level product and runtime overview.
- `docs/ARCHITECTURE.md` — module boundaries and rendering/sim split.
- `docs/DATA_MODEL.md` — object shapes and field meanings.
- `docs/SIMULATION_ASSUMPTIONS.md` — modeling assumptions and doctrine rules.
- `docs/ROADMAP.md` — future ideas; not always current behavior.

## Start here by task

### 1. Combat, sensors, tracks, doctrine, missile behavior
Go to:
- `src/sim.js`
- `tests/sim.test.mjs`
- `docs/DATA_MODEL.md`
- `docs/SIMULATION_ASSUMPTIONS.md`

Search for exact symbols first instead of reading all of `src/sim.js`.

Useful anchors:
- scenario lifecycle: `createScenario`, `stepSim`, `canRunScenario`
- setup/editing: `placeShip`, `duplicateShip`, `deleteShip`, `clearSide`
- loadouts: `defaultLoadout`, `validateLoadout`, `setLoadout`, `usedCells`, `vlsCapacity`
- sensors/tracks: `missileDetectionEnvelope`, force picture / CEC comments, track handling inside `stepSim`
- defense/offense: `chooseDefensiveWeapon`, fleet command comments, fire-planning logic inside `stepSim`
- persistence/export: `serializeScenario`, `restoreScenario`, `exportAfterAction`, `formatLogLines`

### 2. Rendering, map interaction, selection, panels, controls
Go to:
- `src/app.js`
- `index.html`
- `src/styles.css`

Use `src/app.js` section jumps instead of reading top-to-bottom:
- drawing: `drawGrid`, `drawRadarRings`, `drawWeaponRangeRings`, `drawTracks`, `drawMissiles`, `render`
- overlays/panels: `renderFocusStrip`, `renderShipDetails`, `renderPanels`
- interaction: `pickShip`, pointer handlers, keyboard handlers
- sim control: `startScenario`, play/step/save/load/AAR handlers

### 3. CSS/layout or UI shell issues
Go to:
- `src/styles.css` for spacing, panel layout, typography, colors
- `index.html` for panel structure and element ids
- `src/app.js` only if the issue involves dynamically generated markup or DOM state

### 4. Save/load, exports, logs
Go to:
- `src/sim.js` for serialization/export helpers
- `src/app.js` for button wiring and file/clipboard behavior
- `tests/sim.test.mjs` for persistence regressions

### 5. Local server or startup behavior
Go to:
- `package.json`
- `server.mjs`
- `index.html`

### 6. Understanding intended behavior quickly
Start with:
- the matching test in `tests/sim.test.mjs`
- then the smallest relevant function in `src/sim.js` or `src/app.js`

This repo has one large simulation file and one large UI file; tests are usually the quickest path to the rule being enforced.

## What not to read first

- Do **not** start with full-file reads of `src/sim.js`, `src/app.js`, or `tests/sim.test.mjs` unless the task truly spans the whole subsystem.
- Do **not** start with `docs/ROADMAP.md` for current behavior; it includes future work.
- Do **not** read all docs for a small bug. Only open the doc that matches the question:
  - architecture/module split → `docs/ARCHITECTURE.md`
  - object fields/data shape → `docs/DATA_MODEL.md`
  - doctrine/model assumptions → `docs/SIMULATION_ASSUMPTIONS.md`

## Efficient working style for this repo

- Prefer `rg` on exact symbols or gameplay terms before opening large files.
- Treat `src/sim.js` as the source of truth for gameplay rules.
- Treat `src/app.js` as the source of truth for what is rendered and how the user interacts.
- Use `tests/sim.test.mjs` to confirm whether behavior is intentional, especially for determinism, defense logic, loadouts, serialization, and UI defaults.
- Keep changes deterministic; this is a core repository expectation.
- If you change behavior in `src/sim.js`, check whether a nearby test already exists before adding anything new.

## Runtime and validation

- Start locally: `npm start`
- Run automated checks: `npm test`

There is no frontend build pipeline and no separate lint script in the current repo.

## High-signal file routing by problem type

| Problem | Read first | Then read if needed |
| --- | --- | --- |
| Ship placement/setup mode | `src/app.js`, `src/sim.js` (`placeShip`, `deleteShip`) | `tests/sim.test.mjs` |
| Missile launch/flight/intercept | `src/sim.js` (`stepSim`, `chooseDefensiveWeapon`, `interceptPoint`) | `tests/sim.test.mjs`, `docs/SIMULATION_ASSUMPTIONS.md` |
| Radar/tracks/CEC | `src/sim.js` (`missileDetectionEnvelope`, force-picture logic) | `docs/DATA_MODEL.md`, tests |
| Save/load/AAR/log export | `src/sim.js` serialization/export helpers | `src/app.js`, tests |
| Tactical map drawing | `src/app.js` draw functions | `src/styles.css`, `index.html` |
| Panel layout or visual polish | `src/styles.css` | `index.html`, `src/app.js` |
| Keyboard/mouse controls | `src/app.js` event listeners | `index.html` |
| Test failures about rules | matching case in `tests/sim.test.mjs` | relevant function in `src/sim.js` |
| Startup/server issue | `package.json`, `server.mjs` | `index.html` |

