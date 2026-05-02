import { useMemo, useEffect, useState, useRef } from "react";
import { Tile, TILE_W, TILE_H, LAYER_OFFSET } from "./Tile.jsx";

export function Board({ tiles, selected, hintIds, matchIds, mistakeId, glowIds, onTileClick, fitToScreen }) {
  var active = tiles.filter(function(t) { return !t.removed; });
  var containerRef = useRef(null);
  var sizeState = useState({ w:0, h:0 });
  var containerSize = sizeState[0];
  var setContainerSize = sizeState[1];

  useEffect(function() {
    if (!fitToScreen || !containerRef.current) return;
    var el = containerRef.current;
    function measure() { setContainerSize({ w: el.offsetWidth, h: el.offsetHeight }); }
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
  }, [fitToScreen]);

  var layout = useMemo(function() {
    if (tiles.length === 0) return { minCol:0, minRow:0, rawW:0, rawH:0, sorted:[], scale:1 };
    var cols = tiles.map(function(t) { return t.col; });
    var rows = tiles.map(function(t) { return t.row; });
    var mc = Math.min.apply(null, cols);
    var mr = Math.min.apply(null, rows);
    var rawW = (Math.max.apply(null, cols) - mc + 1) * TILE_W + 24;
    var rawH = (Math.max.apply(null, rows) - mr + 1) * TILE_H + 24;
    var scale = 1;
    if (fitToScreen && containerSize.w > 0 && containerSize.h > 0) {
      scale = Math.min(containerSize.w / rawW, containerSize.h / rawH, 1.0);
      scale = Math.max(scale, 0.3);
    }
    var sorted = tiles.filter(function(t) { return !t.removed; }).sort(function(a,b) {
      if (a.layer !== b.layer) return a.layer - b.layer;
      if (a.row   !== b.row)   return a.row   - b.row;
      return a.col - b.col;
    });
    return { minCol:mc, minRow:mr, rawW:rawW, rawH:rawH, sorted:sorted, scale:scale };
  }, [tiles, containerSize, fitToScreen]);

  if (active.length === 0) {
    return <div style={{ color:"#ff6b00", fontSize:40, textAlign:"center", padding:40, fontWeight:900 }}>CLEAR!</div>;
  }

  function renderTiles() {
    return layout.sorted.map(function(tile) {
      var x = (tile.col - layout.minCol) * TILE_W + tile.layer * LAYER_OFFSET;
      var y = (tile.row - layout.minRow) * TILE_H - tile.layer * LAYER_OFFSET;
      return (
        <div key={tile.id} style={{ position:"absolute", left:x, top:y }}>
          <Tile
            tile={tile} allTiles={tiles}
            isSelected={selected ? selected.id === tile.id : false}
            isHint={hintIds.includes(tile.id)}
            isMatch={matchIds.includes(tile.id)}
            isMistake={mistakeId === tile.id}
            isGlow={glowIds.has(tile.id)}
            onClick={function() { onTileClick(tile); }}
          />
        </div>
      );
    });
  }

  if (fitToScreen) {
    var sw = layout.rawW * layout.scale;
    var sh = layout.rawH * layout.scale;
    return (
      <div ref={containerRef} style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"relative", width:sw, height:sh, flexShrink:0 }}>
          <div style={{ position:"absolute", top:0, left:0, width:layout.rawW, height:layout.rawH, transform:"scale("+layout.scale+")", transformOrigin:"top left" }}>
            {renderTiles()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:"relative", width:layout.rawW, height:layout.rawH }}>
      {renderTiles()}
    </div>
  );
}
