import { isTileFree } from "../engine/TileLogic.js";

export var TILE_W = 48;
export var TILE_H = 58;
export var LAYER_OFFSET = 5;

var CHAR_S   = ["","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d"];
var WIND_S   = ["","\u6771","\u5357","\u897f","\u5317"];
var DRAGON_S = ["","\u4e2d","\u767a","\u767d"];
var FLOWER_S = ["","\u6885","\u862d","\u83ca","\u7af9"];
var SEASON_S = ["","\u6625","\u590f","\u79cb","\u51ac"];
var CIRC_S   = ["","\u2460","\u2461","\u2462","\u2463","\u2464","\u2465","\u2466","\u2467","\u2468"];
var BAM_N    = ["","1","2","3","4","5","6","7","8","9"];

var COLORS = { char:"#c0392b", bam:"#1a7a3a", circ:"#1a5276", wind:"#6c3483", dragon:"#c0392b", flower:"#d35400", season:"#117a65" };
var LABELS = { char:"\u842c", bam:"\u7af9", circ:"\u7b52", wind:"", dragon:"", flower:"\u82b1", season:"\u5b63" };

function getSym(tile) {
  switch(tile.suit) {
    case "char":   return CHAR_S[tile.value]   || "";
    case "bam":    return BAM_N[tile.value]     || "";
    case "circ":   return CIRC_S[tile.value]   || "";
    case "wind":   return WIND_S[tile.value]   || "";
    case "dragon": return DRAGON_S[tile.value] || "";
    case "flower": return FLOWER_S[tile.value] || "";
    case "season": return SEASON_S[tile.value] || "";
    default: return "?";
  }
}

export function Tile({ tile, allTiles, isSelected, isHint, isMatch, isMistake, isGlow, onClick }) {
  var free  = isTileFree(tile, allTiles);
  var color = COLORS[tile.suit] || "#333";
  var sym   = getSym(tile);
  var label = LABELS[tile.suit] || "";
  var isBam = tile.suit === "bam";

  var base = {
    position:"absolute", width:TILE_W-2, height:TILE_H-2, borderRadius:6,
    cursor: free ? "pointer" : "default",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    userSelect:"none", WebkitUserSelect:"none", overflow:"hidden",
    zIndex: tile.layer * 10 + (isSelected ? 100 : 1),
  };

  var style;
  if (!free) {
    style = Object.assign({}, base, {
      background:"linear-gradient(160deg,#1e1e28,#14141c)",
      border:"2px solid #0a0a10", opacity:0.6, transform:"scale(0.95)",
    });
  } else if (isMatch) {
    style = Object.assign({}, base, {
      background:"linear-gradient(160deg,#fff9e6,#ffd700)",
      border:"2px solid #ffd700",
      boxShadow:"0 0 30px rgba(255,215,0,1)",
      animation:"tileMatch 0.38s ease-out forwards",
    });
  } else if (isMistake) {
    style = Object.assign({}, base, {
      background:"linear-gradient(160deg,#fdf6ec,#f5e6d0)",
      border:"3px solid #c0392b",
      boxShadow:"0 0 16px rgba(192,57,43,0.9)",
      animation:"tileShake 0.38s ease-out",
    });
  } else if (isSelected) {
    style = Object.assign({}, base, {
      background:"linear-gradient(160deg,#fffde7,#fff59d,#ffd600)",
      border:"3px solid #ffd600",
      boxShadow:"0 0 28px rgba(255,214,0,0.95), 0 "+(4+tile.layer)+"px "+(12+tile.layer*2)+"px rgba(0,0,0,0.5)",
      transform:"translateY(-7px) scale(1.09)",
      transition:"transform 0.12s cubic-bezier(0.34,1.56,0.64,1)",
      animation:"glowPulse 1.5s ease-in-out infinite",
    });
  } else if (isHint) {
    style = Object.assign({}, base, {
      background:"linear-gradient(160deg,#e8f8e8,#c8f0c8)",
      border:"3px solid #27ae60",
      boxShadow:"0 0 20px rgba(39,174,96,0.9)",
      transform:"translateY(-4px) scale(1.06)",
      transition:"transform 0.12s ease",
    });
  } else {
    var depth = "0 "+(3+tile.layer)+"px "+(6+tile.layer*2)+"px rgba(0,0,0,0.45)";
    var inner = "inset 0 2px 0 rgba(255,255,255,0.85),inset 0 -3px 0 rgba(0,0,0,0.15),inset -2px 0 0 rgba(0,0,0,0.08)";
    var glow  = isGlow ? "0 0 14px rgba(255,107,0,0.5)," : "";
    style = Object.assign({}, base, {
      background:"linear-gradient(170deg,#fdfaf3 0%,#f5ead5 50%,#ede0c4 100%)",
      border:"2px solid #b8a88a",
      boxShadow: glow + depth + "," + inner,
      transform:"scale(1)",
      transition:"transform 0.1s ease,box-shadow 0.1s ease",
    });
  }

  return (
    <div onClick={free ? onClick : undefined} style={style}>
      {free && (
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", background:"linear-gradient(180deg,rgba(255,255,255,0.7) 0%,transparent 100%)", borderRadius:"4px 4px 0 0", pointerEvents:"none" }} />
      )}
      <div style={{ fontSize: isBam ? 20 : 24, lineHeight:1, fontWeight:900, color: free ? color : "rgba(60,60,80,0.25)", fontFamily: isBam ? "monospace" : "'Noto Serif SC','STSong',serif", textShadow: free ? "0 1px 3px rgba(0,0,0,0.2)" : "none" }}>
        {sym}
      </div>
      {label && free && (
        <div style={{ fontSize:10, color:color, opacity:0.65, marginTop:1, fontFamily:"serif", fontWeight:700 }}>
          {label}
        </div>
      )}
      {isMatch && (
        <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.9)", borderRadius:4, animation:"flash 0.38s ease-out forwards", pointerEvents:"none" }} />
      )}
    </div>
  );
}
