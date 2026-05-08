export var THEMES = {
  night: {
    id:          "night",
    name:        "Night",
    bg:          "#000000",
    bgGlow1:     "rgba(255,107,0,0.12)",
    bgGlow2:     "rgba(0,229,255,0.08)",
    tileFree:    "linear-gradient(170deg,#fdfaf3 0%,#f5ead5 50%,#ede0c4 100%)",
    tileBorder:  "#b8a88a",
    tileBlocked: "linear-gradient(160deg,#1e1e28,#14141c)",
    tileBlockedBorder: "#0a0a10",
    hudBg:       "rgba(0,0,0,0.95)",
    hudBorder:   "rgba(255,107,0,0.15)",
    accent1:     "#ff6b00",
    accent2:     "#00e5ff",
    text:        "#ffffff",
  },
  jade: {
    id:          "jade",
    name:        "Jade",
    bg:          "#0d2b1a",
    bgGlow1:     "rgba(34,139,34,0.2)",
    bgGlow2:     "rgba(255,215,0,0.1)",
    tileFree:    "linear-gradient(170deg,#ffffff 0%,#f0f8f0 50%,#e0f0e0 100%)",
    tileBorder:  "#2d8a2d",
    tileBlocked: "linear-gradient(160deg,#0a1f0f,#061408)",
    tileBlockedBorder: "#040e06",
    hudBg:       "rgba(8,30,15,0.97)",
    hudBorder:   "rgba(34,139,34,0.3)",
    accent1:     "#ffd700",
    accent2:     "#22c55e",
    text:        "#ffffff",
  },
  royal: {
    id:          "royal",
    name:        "Royal",
    bg:          "#0a0a2e",
    bgGlow1:     "rgba(100,60,200,0.2)",
    bgGlow2:     "rgba(255,215,0,0.12)",
    tileFree:    "linear-gradient(170deg,#fdfaf3 0%,#f5ead5 50%,#ede0c4 100%)",
    tileBorder:  "#c8a000",
    tileBlocked: "linear-gradient(160deg,#0d0d2e,#080820)",
    tileBlockedBorder: "#050515",
    hudBg:       "rgba(8,8,35,0.97)",
    hudBorder:   "rgba(100,60,200,0.3)",
    accent1:     "#ffd700",
    accent2:     "#9b59b6",
    text:        "#ffffff",
  },
  day: {
    id:          "day",
    name:        "Day",
    bg:          "#f5ead8",
    bgGlow1:     "rgba(200,140,60,0.15)",
    bgGlow2:     "rgba(180,120,40,0.1)",
    tileFree:    "linear-gradient(170deg,#ffffff 0%,#faf6f0 50%,#f0e8dc 100%)",
    tileBorder:  "#c8a878",
    tileBlocked: "linear-gradient(160deg,#d4c4b0,#c8b89a)",
    tileBlockedBorder: "#b8a888",
    hudBg:       "rgba(240,225,205,0.97)",
    hudBorder:   "rgba(180,120,40,0.2)",
    accent1:     "#c8650a",
    accent2:     "#2e7d32",
    text:        "#2c1a0a",
  },
};

export var THEME_LIST = ["night","jade","royal","day"];

export function getTheme(id) {
  return THEMES[id] || THEMES.night;
}

export function loadTheme() {
  try {
    var saved = localStorage.getItem("mahjong_theme");
    return saved && THEMES[saved] ? saved : "night";
  } catch(e) { return "night"; }
}

export function saveTheme(id) {
  try { localStorage.setItem("mahjong_theme", id); } catch(e) {}
}
