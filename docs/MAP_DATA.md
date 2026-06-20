# Map Data

The East China Sea presentation layer is generated from the public-domain
Natural Earth 1:10m land and coastline datasets. The checked-in subset is
pinned to Natural Earth vector revision
`ca96624a56bd078437bca8184e78163e5039ad19`.

## Coverage and projection

- Source CRS: WGS84 longitude/latitude (`EPSG:4326`).
- Source crop: computed from the shared projected map bounds in
  `src/world/map-spec.js`, so the coastline/land coverage automatically tracks
  `CORE_MAP_WIDTH_M` and `CORE_MAP_HEIGHT_M` and still retains geometry beyond
  the visible rectangle so coastlines clip cleanly at its edge.
- Display projection: spherical azimuthal equidistant, centered at
  `125 E, 28.2 N`.
- Initial operational core: approximately `118.2-131.8 E`, `25.2-31.2 N`.
  The projected map continues to the viewport edges without stretching or an
  artificial clipping rectangle.
- Land and coastlines are rendered separately, preserving small islands and
  preventing data-crop edges from being mistaken for coastlines.

Run `npm run map:data` to regenerate
`src/ui/data/east-china-sea-data.js`. The application loads the generated local
module and does not require network access at runtime.

Terrain is no longer presentation-only. `src/world/terrain.js` exposes the
shared binary water/land queries used by both rendering and the simulation:
setup placement checks, setup-only map resets, direct-path tests, coastal
detours, and final swept-segment movement guards all use the same projected
Natural Earth geometry. There is still no shallow/deep-water concept; the
navigability rule is simply water vs not-water.

Runtime terrain queries do not scan every Natural Earth vertex. A lazy 0.5 NM
water mask identifies cells whose expanded bounds contain no land, while 24 NM
ring and edge grids narrow coastal queries to relevant geometry. The mask is
conservative: uncertain cells always fall back to polygon containment and
continuous segment/edge intersection checks, so the grid cannot classify an
uncertain coastal cell as navigable water.
