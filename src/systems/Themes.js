export var THEMES = {
  night: {
    id:   "night",
    name: "Night",
    bg:   "#0d1117",
    bg2:  "#161b22",
    glow1:"rgba(255,107,0,0.15)",
    glow2:"rgba(0,229,255,0.1)",
  },
  jade: {
    id:   "jade",
    name: "Jade",
    bg:   "#0d2818",
    bg2:  "#0a1f12",
    glow1:"rgba(34,197,94,0.2)",
    glow2:"rgba(255,215,0,0.1)",
  },
  royal: {
    id:   "royal",
    name: "Royal",
    bg:   "#12103a",
    bg2:  "#0e0c2e",
    glow1:"rgba(139,92,246,0.2)",
    glow2:"rgba(255,215,0,0.12)",
  },
  dawn: {
    id:   "dawn",
    name: "Dawn",
    bg:   "#1a120a",
    bg2:  "#140e06",
    glow1:"rgba(251,146,60,0.2)",
    glow2:"rgba(252,211,77,0.1)",
  },
};

export var THEME_LIST = ["night","jade","royal","dawn"];

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
