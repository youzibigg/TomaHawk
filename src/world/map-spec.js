import { NM } from "../sim/constants.js";

export const CORE_MAP_WIDTH_M = 720 * NM;
export const CORE_MAP_HEIGHT_M = 360 * NM;
export const MAP_WIDTH_M = CORE_MAP_WIDTH_M * 9;
export const MAP_HEIGHT_M = CORE_MAP_HEIGHT_M * 48 / 5;
export const MAP_HALF_WIDTH_M = MAP_WIDTH_M / 2;
export const MAP_HALF_HEIGHT_M = MAP_HEIGHT_M / 2;
export const EAST_CHINA_SEA_CENTER = Object.freeze({ lon: 125, lat: 28.2 });
export const EAST_CHINA_SEA_CROP_PADDING = 0.18;
const EARTH_RADIUS_M = 6371008.8;

export function projectLonLat(lon, lat, center = EAST_CHINA_SEA_CENTER) {
  const toRad = Math.PI / 180;
  const lambda = lon * toRad;
  const phi = lat * toRad;
  const lambda0 = center.lon * toRad;
  const phi0 = center.lat * toRad;
  const delta = lambda - lambda0;
  const cosC = Math.max(-1, Math.min(1,
    Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(delta)
  ));
  const c = Math.acos(cosC);
  const k = c < 1e-12 ? 1 : c / Math.sin(c);
  const x = EARTH_RADIUS_M * k * Math.cos(phi) * Math.sin(delta);
  const north = EARTH_RADIUS_M * k * (
    Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(delta)
  );
  return { x, y: -north };
}

export function inverseProjectLonLat(x, y, center = EAST_CHINA_SEA_CENTER) {
  const toRad = Math.PI / 180;
  const lambda0 = center.lon * toRad;
  const phi0 = center.lat * toRad;
  const north = -y;
  const rho = Math.hypot(x, north);
  if (rho < 1e-9) return { lon: center.lon, lat: center.lat };
  const c = rho / EARTH_RADIUS_M;
  const sinC = Math.sin(c);
  const cosC = Math.cos(c);
  const sinPhi0 = Math.sin(phi0);
  const cosPhi0 = Math.cos(phi0);
  const phi = Math.asin(cosC * sinPhi0 + (north * sinC * cosPhi0) / rho);
  const lambda = lambda0 + Math.atan2(x * sinC, rho * cosPhi0 * cosC - north * sinPhi0 * sinC);
  return { lon: lambda / toRad, lat: phi / toRad };
}

function projectedBoundsSamples(widthM, heightM, padding = EAST_CHINA_SEA_CROP_PADDING) {
  const halfW = (widthM / 2) * (1 + padding);
  const halfH = (heightM / 2) * (1 + padding);
  return [
    [-halfW, -halfH],
    [halfW, -halfH],
    [halfW, halfH],
    [-halfW, halfH],
    [0, -halfH],
    [halfW, 0],
    [0, halfH],
    [-halfW, 0]
  ];
}

export function geographicExtentForProjectedBounds(widthM, heightM, center = EAST_CHINA_SEA_CENTER, padding = EAST_CHINA_SEA_CROP_PADDING) {
  const samples = projectedBoundsSamples(widthM, heightM, padding).map(([x, y]) => inverseProjectLonLat(x, y, center));
  return Object.freeze({
    west: Math.min(...samples.map((p) => p.lon)),
    east: Math.max(...samples.map((p) => p.lon)),
    south: Math.min(...samples.map((p) => p.lat)),
    north: Math.max(...samples.map((p) => p.lat))
  });
}
