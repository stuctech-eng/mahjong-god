import { isTileFree } from "../engine/TileLogic.js";

export var TW = 52;
export var TH = 64;
export var LOFF = 5;

var WIND_SYM = ["","\u6771","\u5357","\u897f","\u5317"];
var WIND_COL = ["","#c0392b","#1a7a3a","#1a5276","#6c3483"];

var POS = {
  dragon: { 1:[0,0], 2:[1,0], 3:[2,0] },
  char:   { 1:[3,0],2:[4,0],3:[5,0],4:[6,0],5:[7,0],6:[8,0],7:[0,1],8:[1,1],9:[2,1] },
  bam:    { 1:[3,1],2:[4,1],3:[5,1],4:[6,1],5:[7,1],6:[8,1],7:[0,2],8:[1,2],9:[2,2] },
  circ:   { 1:[3,2],2:[4,2],3:[5,2],4:[6,2],5:[7,2],6:[8,2],7:[0,3],8:[1,3],9:[2,3] },
  flower: { 1:[4,3],2:[5,3],3:[6,3],4:[7,3] },
  season: { 1:[4,3],2:[5,3],3:[6,3],4:[7,3] },
};

var COLS = 9;
var ROWS = 4;

function spriteStyle(suit, value) {
  var pos = POS[suit] && POS[suit][value];
  if (!pos) return null;
  var px = (pos[0] / (COLS-1)) * 100;
  var py = (pos[1] / (ROWS-1)) * 100;
  return {
    backgroundImage:    "url(/tiles.jpg)",
    backgroundSize:     (COLS*100) + "% " + (ROWS*100) + "%",
    backgroundPosition: px + "% " + py + "%",
    backgroundRepeat:   "no-repeat",
    width:              "100%",
    height:             "100%",
  };
}

var LAYER_COLORS = ["#3a7a3a","#2a6aaa","#7a3aaa","#cc8800","#cc3a3a"];

export function Tile({ tile, allTiles, isSelected, isHint, isMatch, isMistake, isGlow, onClick }) {
  var free = isTileFree(tile, allTiles);
  var sp   = spriteStyle(tile.suit, tile.value);
  var isWind = tile.suit === "wind";
  var side = LAYER_COLORS[tile.layer % LAYER_COLORS.length];
  var sideW = 4;

  var base = {
    position:         "absolute",
    width:            TW - 2,
    height:           TH - 2,
    borderRadius:     7,
    cursor:           free ? "pointer" : "default",
    userSelect:       "none",
    WebkitUserSelect: "none",
    overflow:         "hidden",
    zIndex:           tile.layer * 10 + (isSelected ? 100 : 1),
    transition:       "transform 0.12s ease, box-shadow 0.12s ease",
  };

  var style;

  if (!free) {
    style = Object.assign({}, base, {
      background: "linear-gradient(160deg,#2a2a3a,#1a1a28)",
      border:     "1px solid #111",
      opacity:    0.6,
      transform:  "scale(0.95)",
      transition: "none",
    });
    return <div style={style} />;
  }

  if (isMatch) {
    style = Object.assign({}, base, {
      background: "#ffd700",
      border:     "2px solid #ffd700",
      boxShadow:  "0 0 24px rgba(255,215,0,0.9)",
      animation:  "tileMatch 0.38s ease-out forwards",
      transition: "none",
    });
    return <div style={style} />;
  }

  if (isMistake) {
    style = Object.assign({}, base, {
      background: "#fff",
      border:     "2px solid #c0392b",
      boxShadow:  "0 0 12px rgba(192,57,43,0.8)",
      animation:  "tileShake 0.3s ease-out",
    });
  } else if (isSelected) {
    style = Object.assign({}, base, {
      background: "#fffde7",
      border:     "2px solid #ffd600",
      boxShadow:  "0 0 20px rgba(255,214,0,0.9), " + sideW + "px " + sideW + "px 0 #cc9900",
      transform:  "translateY(-5px) scale(1.05)",
    });
  } else if (isHint) {
    style = Object.assign({}, base, {
      background: "#f0fff0",
      border:     "2px solid #27ae60",
      boxShadow:  "0 0 16px rgba(39,174,96,0.8), " + sideW + "px " + sideW + "px 0 " + side,
      transform:  "translateY(-3px) scale(1.02)",
    });
  } else {
    var glow = isGlow ? "0 0 10px rgba(255,107,0,0.4), " : "";
    style = Object.assign({}, base, {
      background: "#ffffff",
      border:     "1px solid #ddd",
      boxShadow:  glow + sideW + "px " + sideW + "px 0 " + side + ", 0 2px 6px rgba(0,0,0,0.25)",
    });
  }

  return (
    <div onClick={onClick} style={style}>
      {isWind ? (
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:28, fontWeight:900, color:WIND_COL[tile.value], fontFamily:"serif" }}>
            {WIND_SYM[tile.value]}
          </span>
        </div>
      ) : sp ? (
        <div style={sp} />
      ) : (
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:20, color:"#333", fontWeight:900 }}>?</span>
        </div>
      )}
    </div>
  );
}
