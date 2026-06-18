// i18n helpers for the tactical UI.
// English is default; Chinese (Simplified) is the alternate.
// Missile IDs (SM-2MR, SM-6, ESSM, TLAM, TomahawkBlockV), hull designations
// (DDG, CCG, BBG, FFG), and data abbreviations (HP, VLS, AS, AA, %, kn, ch:)
// are never translated — they are military nomenclature.

let currentLang = "en";

const strings = {
  // Panel headings
  "panel.forceInventory": { en: "FORCE INVENTORY", zh: "态势列表" },
  "panel.liveOrder":      { en: "LIVE ORDER",      zh: "实时指令" },

  // Console
  "console.tacticalFeed": { en: "TACTICAL FEED",    zh: "战术日志" },
  "console.copyFeed":     { en: "COPY FEED",        zh: "复制日志" },

  // Left rail tools
  "tool.blue":   { en: "BLUE",   zh: "蓝方" },
  "tool.red":    { en: "RED",    zh: "红方" },
  "tool.ruler":  { en: "RULER",  zh: "标尺" },
  "tool.rev":    { en: "REV",    zh: "重置" },

  // Map option toggles
  "opt.grid":    { en: "GRID",    zh: "网格" },
  "opt.tracks":  { en: "TRACKS",  zh: "航迹" },
  "opt.radar":   { en: "RADAR",   zh: "雷达" },
  "opt.wez":     { en: "WEZ",     zh: "杀伤区" },
  "opt.weapons": { en: "WEAPONS", zh: "武器" },
  "opt.all":     { en: "ALL",     zh: "全部" },
  "opt.sel":     { en: "SEL",     zh: "选定" },
  "opt.off":     { en: "OFF",     zh: "关闭" },

  // Bottom bar buttons
  "btn.step":    { en: "STEP",    zh: "步进" },
  "btn.save":    { en: "SAVE",    zh: "保存" },
  "btn.load":    { en: "LOAD",    zh: "加载" },
  "btn.aar":     { en: "AAR",     zh: "战报" },
  "btn.copyLog": { en: "COPY LOG", zh: "复制日志" },
  "btn.speed":   { en: "SPD",     zh: "速度" },

  // Status messages
  "status.ready":    { en: "SETUP READY",           zh: "部署就绪" },
  "status.setup":    { en: "Place one blue and one red ship, then press play.", zh: "放置蓝红各一舰，按空格开始。" },
  "status.paused":   { en: "PAUSED",               zh: "已暂停" },
  "status.ended":    { en: "ENDED",                zh: "已结束" },
  "status.running":  { en: "RUNNING",              zh: "运行中" },
  "status.invalid":  { en: "SETUP NEEDS BLUE+RED", zh: "需要蓝红双方" },
  "status.logCopied":{ en: "LOG COPIED · {n} lines", zh: "日志已复制 · {n} 行" },
  "status.logFailed":{ en: "LOG COPY FAILED",      zh: "复制失败" },

  // Ship detail card row labels
  "detail.radar": { en: "RADAR", zh: "雷达" },
  "detail.prop":  { en: "PROP",  zh: "动力" },
  "detail.vls":   { en: "VLS",   zh: "垂发" },
  "detail.fcs":   { en: "FCS",   zh: "射控" },
  "detail.ciws":  { en: "CIWS",  zh: "近防" },
  "detail.cic":   { en: "CIC",   zh: "战情" },

  // Ship class labels (for select and descriptions)
  "ship.ddg":  { en: "DDG", zh: "驱逐舰" },
  "ship.ccg":  { en: "CCG", zh: "巡洋舰" },
  "ship.bbg":  { en: "BBG", zh: "战列舰" },
  "ship.ffg":  { en: "FFG", zh: "护卫舰" },
  "ship.desc.ddg":  { en: "Guided-Missile Destroyer", zh: "导弹驱逐舰" },
  "ship.desc.ccg":  { en: "Guided-Missile Cruiser",   zh: "导弹巡洋舰" },
  "ship.desc.bbg":  { en: "Guided-Missile Battleship", zh: "导弹战列舰" },
  "ship.desc.ffg":  { en: "Frigate",                   zh: "护卫舰" },

  // Battle status bar
  "status.ships": { en: "Ships", zh: "舰" },
  "status.hp":    { en: "HP",    zh: "血" },
  "status.agg":   { en: "AGG",   zh: "攻势" },

  // Inventory header columns
  "inv.ship":  { en: "SHIP",  zh: "舰名" },
  "inv.hp":    { en: "HP",    zh: "血量" },
  "inv.vls":   { en: "VLS",   zh: "垂发" },
  "inv.sm2":   { en: "SM2",   zh: "SM2" },
  "inv.sm6":   { en: "SM6",   zh: "SM6" },
  "inv.essm":  { en: "ESSM",  zh: "ESSM" },
  "inv.mstk":  { en: "MSTK",  zh: "MSTK" },
  "inv.tlam":  { en: "TLAM",  zh: "TLAM" },

  // Placement / setup
  "place.addBlue": { en: "Add blue DDG", zh: "添加蓝方" },
  "place.addRed":  { en: "Add red DDG",  zh: "添加红方" },
  "place.class":   { en: "Ship class for placement", zh: "选择舰型" },
  "place.measure": { en: "Measure range/bearing (R)", zh: "测距/测向 (R)" },
  "place.revert":  { en: "Revert scenario",          zh: "重置想定" },
  "place.collapse":{ en: "Collapse panel (Tab)",      zh: "折叠面板 (Tab)" },

  // About overlay
  "about.title":      { en: "TOMAHAWK",            zh: "TOMAHAWK" },
  "about.subtitle":   { en: "Naval Sandbox v0.1",   zh: "海战沙盘 v0.1" },
  "about.desc1":      {
    en: "A real-time naval combat sandbox for experimenting with fleet compositions, doctrine settings, and tactical engagements. Place ships, configure loadouts and ROE, then watch the AI command structure execute multi-axis strike and defense plans.",
    zh: "实时海战沙盘，用于试验舰队编成、作战条令和战术交战。部署舰艇，配置载弹和交战规则，观察AI指挥体系执行多轴打击和防御计划。"
  },
  "about.h2controls": { en: "Controls",     zh: "操作" },
  "about.h2mechanics":{ en: "Mechanics",    zh: "机制" },
  "about.descMech1":  {
    en: "Blue vs Red fleets. Each ship has a VLS cell count, subsystem health (radar, propulsion, fire control, CIWS, CIC), and doctrine settings that control engagement behavior.",
    zh: "蓝方对红方舰队。每艘舰拥有垂发单元数、子系统状态（雷达、动力、射控、近防、战情）及控制交战行为的条令设定。"
  },
  "about.descMech2":  {
    en: "Weapons: SM-2MR (area AA), SM-6 (long-range AA/AS), ESSM (point defense), MaritimeStrike (ASuW), TLAM (land attack). CIWS provides a last-ditch defense against incoming missiles.",
    zh: "武器：SM-2MR（区域防空）、SM-6（远程防空/反舰）、ESSM（点防御）、MaritimeStrike（反舰）、TLAM（对地攻击）。近防系统为最后防线。"
  },
  "about.descMech3":  {
    en: "The command AI assesses force balance and adjusts aggression automatically. Right-click ships to inspect subsystem details in real time.",
    zh: "指挥AI自动评估兵力对比并调整攻势等级。右键点击舰艇可实时检查子系统状态。"
  },
  "about.kbSpace":    { en: "Play / Pause simulation",          zh: "播放 / 暂停模拟" },
  "about.kbDot":      { en: "Step forward 0.25 s",              zh: "前进 0.25 秒" },
  "about.kbEsc":      { en: "Cancel tool / deselect",           zh: "取消工具 / 取消选择" },
  "about.kbR":        { en: "Activate ruler tool",              zh: "启用标尺工具" },
  "about.kbTab":      { en: "Cycle selected ship",              zh: "循环选择舰艇" },
  "about.kbTilde":    { en: "Toggle tactical feed",             zh: "切换战术日志" },
  "about.kbDel":      { en: "Delete selected (setup only)",     zh: "删除选中（仅部署阶段）" },
  "about.kbLmb":      { en: "Select ship / place unit",         zh: "选择舰艇 / 放置单位" },
  "about.kbRmb":      { en: "Add to selection / box select",    zh: "追加选择 / 框选" },
  "about.kbMmb":      { en: "Pan map",                          zh: "平移地图" },
  "about.kbScroll":   { en: "Zoom in / out",                    zh: "缩放" },
  "about.close":      { en: "CLOSE",                            zh: "关闭" },

  // Tooltip hints for map options
  "tip.wzAll":   { en: "All ships",     zh: "全部舰艇" },
  "tip.wzSel":   { en: "Selected only", zh: "仅选中" },
  "tip.wzOff":   { en: "Hide rings",    zh: "隐藏" },

  // Language toggle
  "lang.toggle": { en: "中", zh: "EN" },
};

/** Return the translated string for `key` in the current language. */
export function t(key) {
  const entry = strings[key];
  if (!entry) return key;
  return entry[currentLang] ?? entry.en ?? key;
}

/** Return the current language code. */
export function getLang() {
  return currentLang;
}

/** Set the language and return the new code. */
export function setLang(lang) {
  currentLang = lang === "zh" ? "zh" : "en";
  return currentLang;
}

/** Toggle between en and zh, returning the new code. */
export function toggleLang() {
  currentLang = currentLang === "en" ? "zh" : "en";
  return currentLang;
}

/** Return the localized hull designator (e.g. DDG → 驱逐舰 in zh). */
export function hullLabel(hull) {
  const key = `ship.${(hull || "DDG").toLowerCase()}`;
  return t(key);
}
