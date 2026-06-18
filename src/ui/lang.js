// i18n helpers for the tactical UI.
// English is default; Chinese (Simplified) is the alternate.
// Missile IDs, hull designations, and data abbreviations are never translated.

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
  "opt.grid":   { en: "GRID",   zh: "网格" },
  "opt.tracks": { en: "TRACKS", zh: "航迹" },
  "opt.radar":  { en: "RADAR",  zh: "雷达" },
  "opt.wez":    { en: "WEZ",    zh: "杀伤区" },
  "opt.weapons":{ en: "WEAPONS", zh: "武器" },
  "opt.all":    { en: "ALL",    zh: "全部" },
  "opt.sel":    { en: "SEL",    zh: "选定" },
  "opt.off":    { en: "OFF",    zh: "关闭" },

  // Bottom bar buttons
  "btn.step":    { en: "STEP",    zh: "步进" },
  "btn.save":    { en: "SAVE",    zh: "保存" },
  "btn.load":    { en: "LOAD",    zh: "加载" },
  "btn.aar":     { en: "AAR",     zh: "战报" },
  "btn.copyLog": { en: "COPY LOG", zh: "复制日志" },
  "btn.speed":   { en: "SPD",     zh: "速度" },

  // Status messages
  "status.setup":   { en: "Place one blue and one red ship, then press play.", zh: "放置蓝红各一舰，按空格开始。" },
  "status.paused":  { en: "PAUSED",  zh: "已暂停" },
  "status.ended":   { en: "ENDED",   zh: "已结束" },
  "status.invalid": { en: "SETUP NEEDS BLUE+RED", zh: "需要蓝红双方" },
  "status.logCopied": { en: "LOG COPIED · {n} lines", zh: "日志已复制 · {n} 行" },
  "status.logFailed": { en: "LOG COPY FAILED", zh: "复制失败" },

  // Ship detail card row labels
  "detail.radar": { en: "RADAR", zh: "雷达" },
  "detail.prop":  { en: "PROP",  zh: "动力" },
  "detail.vls":   { en: "VLS",   zh: "垂发" },
  "detail.fcs":   { en: "FCS",   zh: "射控" },
  "detail.ciws":  { en: "CIWS",  zh: "近防" },
  "detail.cic":   { en: "CIC",   zh: "战情" },

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
