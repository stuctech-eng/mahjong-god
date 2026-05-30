import { isTileFree } from "../engine/TileLogic.js";

export var TILE_W = 52;
export var TILE_H = 64;
export var LAYER_OFFSET = 5;

var COLS = 9;
var ROWS = 4;

var POS = {
  dragon: { 1:[0,0], 2:[1,0], 3:[2,0] },
  char:   { 1:[3,0], 2:[4,0], 3:[5,0], 4:[6,0], 5:[7,0], 6:[8,0], 7:[0,1], 8:[1,1], 9:[2,1] },
  bam:    { 1:[3,1], 2:[4,1], 3:[5,1], 4:[6,1], 5:[7,1], 6:[8,1], 7:[0,2], 8:[1,2], 9:[2,2] },
  circ:   { 1:[3,2], 2:[4,2], 3:[5,2], 4:[6,2], 5:[7,2], 6:[8,2], 7:[0,3], 8:[1,3], 9:[2,3] },
  flower: { 1:[4,3], 2:[5,3], 3:[6,3], 4:[7,3] },
  season: { 1:[4,3], 2:[5,3], 3:[6,3], 4:[7,3] },
};

var WIND_SYM  = ["","\u6771","\u5357","\u897f","\u5317"];
var WIND_COL  = ["","#c0392b","#1a7a3a","#1a5276","#6c3483"];

function getSpriteStyle(suit, value) {
  var p = POS[suit] && POS[suit][value];
  if (!p) return null;
  var col = p[0];
  var row = p[1];
  var px = (col / (COLS - 1)) * 100;
  var py = (row / (ROWS - 1)) * 100;
  return {
    backgroundImage:    "url(/tiles.jpg)",
    backgroundSize:     (COLS * 100) + "% " + (ROWS * 100) + "%",
    backgroundPosition: px + "% " + py + "%",
    backgroundRepeat:   "no-repeat",
  };
}

export function Tile({ tile, allTiles, isSelected, isHint, isMatch, isMistake, isGlow, onClick }) {
  var free = isTileFree(tile, allTiles);
  var spriteStyle = getSpriteStyle(tile.suit, tile.value);
  var isWind = tile.suit === "wind";

  var layerColors = ["#4a7a4a","#3a6aaa","#7a4aaa","#cc8800","#cc4444"];
  var sideColor = layerColors[tile.layer % layerColors.length];

  var base = {
    position:        "absolute",
    width:           TILE_W - 2,
    height:          TILE_H - 2,
    borderRadius:    8,
    cursor:          free ? "pointer" : "default",
    userSelect:      "none",
    WebkitUserSelect:"none",
    overflow:        "hidden",
    zIndex:          tile.layer * 10 + (isSelected ? 100 : 1),
  };

  var sideW = 5;

  var style;

  if (!free) {
    style = Object.assign({}, base, {
      background: "linear-gradient(160deg,#2a2a3a,#1a1a28)",
      border:     "2px solid #111",
      opacity:    0.65,
    });
    return <div style={style} />;
  }

  if (isMatch) {
    style = Object.assign({}, base, {
      background: "#ffd700",
      border:     "2px solid #ffd700",
      boxShadow:  "0 0 30px rgba(255,215,0,1)",
      animation:  "matchPop 0.2s ease-out forwards",
    });
    return <div style={style} />;
  }

  if (isMistake) {
    style = Object.assign({}, base, {
      border:     "3px solid #c0392b",
      boxShadow:  "0 0 16px rgba(192,57,43,0.9)",
      animation:  "shake 0.25s ease-out",
      background: "#fff",
    });
  } else if (isSelected) {
    style = Object.assign({}, base, {
      border:     "3px solid #ffd600",
      boxShadow:  "0 0 28px rgba(255,214,0,0.95)",
      transform:  "translateY(-6px) scale(1.06)",
      transition: "transform 0.12s ease",
      background: "#fffde7",
    });
  } else if (isHint) {
    style = Object.assign({}, base, {
      border:     "3px solid #27ae60",
      boxShadow:  "0 0 20px rgba(39,174,96,0.9)",
      transform:  "translateY(-3px) scale(1.03)",
      background: "#f0fff0",
    });
  } else {
    style = Object.assign({}, base, {
      background: "#ffffff",
      border:     "2px solid #ddd",
      boxShadow:  sideW + "px " + sideW + "px 0 " + sideColor + ", 0 2px 4px rgba(0,0,0,0.3)",
    });
  }

  return (
    <div style={style}>
      {isWind ? (
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:28, fontWeight:900, color:WIND_COL[tile.value], fontFamily:"'Noto Serif SC',serif" }}>
            {WIND_SYM[tile.value]}
          </span>
        </div>
      ) : spriteStyle ? (
        <div style={Object.assign({}, spriteStyle, { width:"100%", height:"100%", borderRadius:6 })} />
      ) : (
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:24, color:"#333", fontWeight:900 }}>?</span>
        </div>
      )}
      {isMatch && (
        <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.9)", borderRadius:6, animation:"flashWhite 0.2s ease-out forwards", pointerEvents:"none" }} />
      )}
    </div>
  );
}
