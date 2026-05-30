import { useMemo, useEffect, useState, useRef } from "react";
import { Tile, TW, TH, LOFF } from "./Tile.jsx";

export function Board({ tiles, selected, hintIds, matchIds, mistakeId, glowIds, onTileClick }) {
  var active = tiles.filter(function(t) { return !t.removed; });
  var ref = useRef(null);
  var szState = useState({ w:0, h:0 });
  var sz = szState[0]; var setSz = szState[1];

  useEffect(function() {
    var el = ref.current;
    if (!el) return;
    function measure() { setSz({ w:el.offsetWidth, h:el.offsetHeight }); }
    measure();
    var obs = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (obs) obs.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return function() {
      if (obs) obs.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  var layout = useMemo(function() {
    if (!tiles.length) return { mc:0, mr:0, rw:0, rh:0, sorted:[], scale:1 };
    var cols = tiles.map(function(t) { return t.col; });
    var rows = tiles.map(function(t) { return t.row; });
    var mc = Math.min.apply(null, cols);
    var mr = Math.min.apply(null, rows);
    var rw = (Math.max.apply(null, cols) - mc + 2) * TW + 16;
    var rh = (Math.max.apply(null, rows) - mr + 2) * TH + 16;
    var scale = 1;
    if (sz.w > 0 && sz.h > 0) {
      scale = Math.min((sz.w - 8) / rw, (sz.h - 8) / rh, 1.0);
      scale = Math.max(scale, 0.4);
    }
    var sorted = tiles.filter(function(t) { return !t.removed; }).sort(function(a,b) {
      if (a.layer !== b.layer) return a.layer - b.layer;
      if (a.row   !== b.row)   return a.row   - b.row;
      return a.col - b.col;
    });
    return { mc:mc, mr:mr, rw:rw, rh:rh, sorted:sorted, scale:scale };
  }, [tiles, sz]);

  if (!active.length) {
    return (
      <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:"#ffd700", fontSize:36, fontWeight:900 }}>CLEAR!</div>
      </div>
    );
  }

  var sw = layout.rw * layout.scale;
  var sh = layout.rh * layout.scale;

  return (
    <div ref={ref} style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"relative", width:sw, height:sh, flexShrink:0 }}>
        <div style={{
          position:"absolute", top:0, left:0,
          width:layout.rw, height:layout.rh,
          transform:"scale("+layout.scale+")",
          transformOrigin:"top left",
        }}>
          {layout.sorted.map(function(tile) {
            var x = (tile.col - layout.mc) * TW + tile.layer * LOFF;
            var y = (tile.row - layout.mr) * TH - tile.layer * LOFF;
            return (
              <div key={tile.id} style={{ position:"absolute", left:x, top:y }}>
                <Tile
                  tile={tile}
                  allTiles={tiles}
                  isSelected={selected ? selected.id === tile.id : false}
                  isHint={hintIds.includes(tile.id)}
                  isMatch={matchIds.includes(tile.id)}
                  isMistake={mistakeId === tile.id}
                  isGlow={glowIds.has(tile.id)}
                  onClick={function() { onTileClick(tile); }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
