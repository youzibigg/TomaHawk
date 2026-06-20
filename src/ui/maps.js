import {
  CORE_MAP_HEIGHT_M,
  CORE_MAP_WIDTH_M,
  EAST_CHINA_SEA_CENTER,
  MAP_HALF_HEIGHT_M,
  MAP_HALF_WIDTH_M,
  MAP_HEIGHT_M,
  MAP_WIDTH_M,
  TACTICAL_MAPS,
  isLandPoint,
  projectLonLat,
  tacticalMap
} from "../world/terrain.js";

export { CORE_MAP_HEIGHT_M, CORE_MAP_WIDTH_M, EAST_CHINA_SEA_CENTER, MAP_HALF_HEIGHT_M, MAP_HALF_WIDTH_M, MAP_HEIGHT_M, MAP_WIDTH_M, TACTICAL_MAPS, isLandPoint, projectLonLat, tacticalMap };

export const KM = 1000;
export const GRID_MINOR_M = 20 * KM;
export const GRID_MAJOR_M = 100 * KM;
export const WEAPON_LABEL_MIN_SCALE = 0.0012;

export function formatDistanceKm(meters) {
  const km = Math.max(0, meters) / KM;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

export function niceScaleDistanceM(scale, targetPx = 100) {
  const rawMeters = targetPx / Math.max(scale, Number.EPSILON);
  const magnitude = 10 ** Math.floor(Math.log10(rawMeters));
  const candidates = [1, 2, 5, 10].map((factor) => factor * magnitude);
  const meters = candidates.reduce((best, candidate) => (
    Math.abs(candidate * scale - targetPx) < Math.abs(best * scale - targetPx) ? candidate : best
  ));
  return { meters, pixels: meters * scale };
}

export function shouldShowWeaponLabels(scale) {
  return scale >= WEAPON_LABEL_MIN_SCALE;
}
