// Pure presentation helpers for the tactical UI.
//
// Everything here is free of canvas/DOM access and global state: coordinate
// transforms take an explicit camera + viewport, and the panel builders return
// HTML strings. This keeps the view logic unit-testable (see tests/ui.test.mjs)
// and is the first step of separating rendering from `src/app.js`.

import { SIDE, usedCells, vlsCapacity, battleSummaryCounts } from "../sim.js";

// --- colors ----------------------------------------------------------------

export function sideColor(side) {
  return side === SIDE.BLUE ? "#65a7ff" : "#ff6b63";
}

export function sideSoftColor(side) {
  return side === SIDE.BLUE ? "rgba(101,167,255,.18)" : "rgba(255,107,99,.16)";
}

// --- camera / viewport transforms ------------------------------------------

export function worldToScreen(p, camera, viewW, viewH) {
  return {
    x: viewW / 2 + (p.x - camera.x) * camera.scale,
    y: viewH / 2 + (p.y - camera.y) * camera.scale
  };
}

export function screenToWorld(x, y, camera, viewW, viewH) {
  return {
    x: (x - viewW / 2) / camera.scale + camera.x,
    y: (y - viewH / 2) / camera.scale + camera.y
  };
}

// --- per-ship derived state ------------------------------------------------

export function shipHpState(ship) {
  const maxHp = Math.max(1, Math.ceil(ship.damageResist ?? 3));
  const damage = Math.max(0, Math.round(ship.damage ?? 0));
  const currentHp = Math.max(0, maxHp - damage);
  return { currentHp, maxHp, damage };
}

export function vlsLoadState(ship) {
  const used = Math.max(0, Math.round(usedCells(ship.loadout)));
  const cap = Math.max(1, Math.round(vlsCapacity(ship)));
  const fill = Math.max(0, Math.min(1, used / cap));
  return { used, cap, fill };
}

export function displayCount(ship, missileId) {
  const count = Number(ship?.loadout?.[missileId]);
  if (!Number.isFinite(count)) return 0;
  return Math.max(0, Math.round(count));
}

export function commandPosture(sim, side) {
  return sim.commandState?.get(side) ?? {
    aggression: 0.5,
    advantage: 0,
    ownOffense: 0,
    ownVls: 0,
    ownPower: 0,
    enemyOffenseEstimate: 0,
    enemyVlsEstimate: 0,
    enemyPower: 0,
    targetBreadth: 1,
    raidDepth: 2
  };
}

// --- panel HTML builders ---------------------------------------------------

export function postureBar(side, posture) {
  const label = side === SIDE.BLUE ? "B" : "R";
  const pct = Math.round(posture.aggression * 100);
  return `
    <span class="${side === SIDE.BLUE ? "blue" : "red"} posture-chip">
      ${label} AGG
      <span class="agg-meter ${side === SIDE.BLUE ? "blue" : "red"}"><i style="width:${pct}%"></i></span>
      <b>${pct}%</b>
    </span>
  `;
}

export function renderBattleStatus(sim) {
  const c = battleSummaryCounts(sim);
  const bluePosture = commandPosture(sim, SIDE.BLUE);
  const redPosture = commandPosture(sim, SIDE.RED);
  return `
    <span class="red">R ${c.redShips}</span>
    <span class="blue">B ${c.blueShips}</span>
    <span class="red">R HP ${c.redHp}/${c.redHpMax}</span>
    <span class="blue">B HP ${c.blueHp}/${c.blueHpMax}</span>
    <span class="red">R AS ${c.redAntiShip}</span>
    <span class="red">R AA ${c.redAntiAir}</span>
    <span class="blue">B AS ${c.blueAntiShip}</span>
    <span class="blue">B AA ${c.blueAntiAir}</span>
    ${postureBar(SIDE.RED, redPosture)}
    ${postureBar(SIDE.BLUE, bluePosture)}
  `;
}

export function inventoryHeadHtml() {
  return `<div class="inventory-head"><span>SHIP</span><span>HP</span><span>VLS</span><span>SM2</span><span>SM6</span><span>ESSM</span><span>MSTK</span><span>TLAM</span></div>`;
}

export function inventoryDividerHtml() {
  return `<div class="inventory-divider" aria-hidden="true"></div>`;
}

export function inventoryRowHtml(ship, selected = false) {
  const hp = shipHpState(ship);
  return `
      <button class="inventory-row ${ship.side.toLowerCase()} ${ship.alive ? "" : "sunk"} ${selected ? "selected" : ""}" data-select-ship="${ship.id}">
        <span>${ship.id}</span>
        <b style="color:${hp.currentHp < hp.maxHp ? '#f7b955' : ''}">${hp.currentHp}/${hp.maxHp}</b>
        <b>${Math.round(usedCells(ship.loadout))}/${ship.vlsCells ?? 96}</b>
        <b>${displayCount(ship, "SM-2MR")}</b>
        <b>${displayCount(ship, "SM-6")}</b>
        <b>${displayCount(ship, "ESSM")}</b>
        <b>${displayCount(ship, "MaritimeStrike")}</b>
        <b>${displayCount(ship, "TomahawkBlockV")}</b>
      </button>
    `;
}

// Build the full fleet inventory markup for an ordered ship list.
export function inventoryHtml(orderedShips, isSelected = () => false) {
  const rows = [];
  let lastSide = null;
  for (const ship of orderedShips) {
    if (lastSide && ship.side !== lastSide) rows.push(inventoryDividerHtml());
    rows.push(inventoryRowHtml(ship, isSelected(ship.id)));
    lastSide = ship.side;
  }
  return `${inventoryHeadHtml()}${rows.join("")}`;
}
