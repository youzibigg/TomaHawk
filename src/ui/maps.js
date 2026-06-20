import { NM } from "../sim.js";

const nmPoint = (x, y) => ({ x: x * NM, y: y * NM });

export const TACTICAL_MAPS = {
  openSea: { id: "openSea", land: [] },
  eastChinaSea: {
    id: "eastChinaSea",
    land: [
      [nmPoint(-300, -220), nmPoint(-168, -220), nmPoint(-151, -176), nmPoint(-158, -132), nmPoint(-136, -90), nmPoint(-147, -42), nmPoint(-122, 4), nmPoint(-132, 48), nmPoint(-111, 92), nmPoint(-124, 136), nmPoint(-101, 180), nmPoint(-112, 230), nmPoint(-300, 230)],
      [nmPoint(80, 112), nmPoint(95, 98), nmPoint(108, 111), nmPoint(112, 144), nmPoint(103, 178), nmPoint(89, 194), nmPoint(79, 168), nmPoint(76, 136)],
      [nmPoint(58, -230), nmPoint(170, -230), nmPoint(163, -190), nmPoint(141, -159), nmPoint(128, -125), nmPoint(98, -112), nmPoint(76, -134), nmPoint(67, -174)],
      [nmPoint(172, -154), nmPoint(208, -140), nmPoint(235, -118), nmPoint(222, -91), nmPoint(192, -101), nmPoint(164, -126)]
    ]
  }
};

export function tacticalMap(id) {
  return TACTICAL_MAPS[id] ?? TACTICAL_MAPS.openSea;
}

export function isLandPoint(point, map = TACTICAL_MAPS.openSea) {
  return map.land.some((polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i];
      const b = polygon[j];
      const crosses = (a.y > point.y) !== (b.y > point.y)
        && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
      if (crosses) inside = !inside;
    }
    return inside;
  });
}
