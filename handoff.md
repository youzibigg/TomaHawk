# TomaHawk UI Handoff

## Current objective

Finish and verify the expanded East China Sea tactical world. The displayed
world must contain real coastline data across an area four times the width and
four times the height of the original map. Camera, rendered-map, and simulation
bounds must match, with no scrolling outside the rigid border and no ship snap
when the simulation starts.

Keep English/Chinese UI behavior synchronized. Verify Chrome and Edge at 100%
browser scale and laptop full-screen resolution.

## Changes already made

- `scripts/build-east-china-sea-map.mjs`
  - Natural Earth 1:10m crop changed to `97.8-152.2 E`, `16.2-40.2 N`.
  - This is four times the original `118.2-131.8 E`, `25.2-31.2 N` view in
    each dimension about the existing `125 E`, `28.2 N` projection center.
- `src/ui/maps.js`
  - Added `CORE_MAP_WIDTH_M = 720 * NM` and `CORE_MAP_HEIGHT_M = 360 * NM`.
  - `MAP_WIDTH_M` and `MAP_HEIGHT_M` are exactly four times those core values.
  - Geographic extent matches the expanded Natural Earth crop.
- `src/sim/scenario.js`
  - Scenario bounds changed to `2880 * NM` by `1440 * NM`, matching the UI.
  - This alignment is required to prevent ships snapping at the first sim tick.
- `src/app.js`
  - Replaced the fixed minimum camera scale with a viewport-derived minimum:
    `max(innerWidth / MAP_WIDTH_M, innerHeight / MAP_HEIGHT_M)`.
  - Existing camera clamping and rigid map-border work should be reviewed and
    browser-tested against the new exact dimensions.
- `tests/map-boundary.test.mjs`
  - Added regression coverage for the exact 4x dimensions, geographic crop,
    and matching scenario/rendered bounds.
- `tests/sim.test.mjs`
  - Updated expected scenario bounds to `2880 * NM` by `1440 * NM`.
- `package.json`
  - Added `npm run refresh:start`, which regenerates map data and starts the
    server. Normal `npm start` remains offline and serves the checked-in asset.
- `README.md`
  - Added bilingual documentation for regeneration and the 4x world contract.

## Verification update (2026-06-20)

- Regenerated `src/ui/data/east-china-sea-data.js` with 723 land rings and 286
  coastline paths for the expanded crop.
- Fixed a browser boot error in `src/app.js`: `clampCamera()` now uses the
  existing viewport-derived `minimumCameraScale()` instead of the undefined
  `MIN_CAMERA_SCALE` identifier.
- Added a regression assertion to `tests/map-boundary.test.mjs` for the camera
  minimum-scale wiring.
- Hardened setup and restore coordinate handling so ships are clamped to valid
  scenario bounds before the first simulation tick.
- Stopped unchanged inventory/detail/log markup from being replaced every frame,
  which had caused intermittent detached-row click failures.
- `npm test` passes (85/85), including camera boot wiring, stable panel DOM,
  boundary normalization, and restored-save coordinate coverage.
- `http://127.0.0.1:4173/health` returned `ok`.
- In-app Browser startup remains blocked by `codex/sandbox-state-meta: missing
  field sandboxPolicy`; local stable Chrome/Edge Playwright verification is the
  active fallback.
- Stable Chrome and Edge both passed at a 1920x1080 viewport and 100% page
  scale with no console warnings/errors. English/Chinese switching, inventory
  selection, map/filter controls, panel and feed collapse, the about dialog,
  reset, step, and start/pause were exercised.

## Remaining verification work

The previous Codex thread could not start any Windows process. Both runners
failed before PowerShell/Node execution:

```text
CreateProcessAsUserW failed: 5
codex/sandbox-state-meta: missing field sandboxPolicy
```

Do not treat this as an npm or repository error. The next thread must first
confirm that a trivial shell command works.

## Required next steps

1. Read root `AGENTS.md`, then inspect only the relevant map/render/startup files.
2. Confirm process launch:

   ```powershell
   Write-Output process-launch-ok
   node --version
   npm --version
   ```

3. Review the working-tree diff. Preserve unrelated/user changes.
4. Regenerate the checked-in Natural Earth asset:

   ```powershell
   npm run map:data
   ```

5. Run all automated checks:

   ```powershell
   npm test
   ```

6. Restart the server after freeing port `4173`:

   ```powershell
   Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue |
     ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   npm start
   ```

7. Verify `http://127.0.0.1:4173/health` returns `ok` and check the browser
   console for errors.
8. Browser-test both English and Chinese in full-screen Chrome and Edge at 100%.
9. Capture full-screen screenshots showing the expanded coastline and all four
   rigid world edges at maximum zoom-out.
10. Place ships near multiple parts of the expanded world, start the simulation,
    and confirm their displayed positions do not jump.

## Acceptance criteria

- The expanded view visibly contains newly generated real Natural Earth
  coastline; it is not merely additional empty ocean.
- Width and height are each exactly four times the original tactical view.
- The camera cannot pan or zoom beyond the rigid rectangular world boundary.
- Coastline, grid, ships, rings, and other world layers do not render outside
  the boundary.
- Starting the simulation does not move a ship merely because UI and sim bounds
  differ.
- `npm test` passes.
- English and Chinese render correctly in both Chrome and Edge at 100%.
- No browser console errors.

If the enlarged 1:10m asset causes unacceptable load/render time, optimize the
generated geometry deterministically in the build script. Do not replace it
with illustrative or fabricated coastline data and do not change combat logic.
