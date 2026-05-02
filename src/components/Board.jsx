import { useMemo } from "react";
import { Tile, TILE_W, TILE_H, LAYER_OFFSET } from "./Tile.jsx";

export function Board({ tiles, selected, hintIds, matchIds, mistakeId, glowIds, onTileClick }) {
  var active = tiles.filter(function(t) { return !t.removed; });

  var layout = useMemo(function() {
    if (tiles.length === 0) return { minCol:0, minRow:0, boardW:0, boardH:0, sorted:[] };
    var cols = tiles.map(function(t) { return t.col; });
    var rows = tiles.map(function(t) { return t.row; });
    var mc = Math.min.apply(null, cols);
    var mr = Math.min.apply(null, rows);
    var w  = (Math.max.apply(null, cols) - mc + 2) * TILE_W + 32;
    var h  = (Math.max.apply(null, rows) - mr + 2) * TILE_H + 32;
    var s  = tiles.filter(function(t) { return !t.removed; }).sort(function(a,b) {
      if (a.layer !== b.layer) return a.layer - b.layer;
      if (a.row   !== b.row)   return a.row   - b.row;
      return a.col - b.col;
    });
    return { minCol:mc, minRow:mr, boardW:w, boardH:h, sorted:s };
  }, [tiles]);

  if (active.length === 0) {
    return <div style={{ color:"#ff6b00", fontSize:40, textAlign:"center", padding:40, fontWeight:900 }}>CLEAR!</div>;
  }

  return (
    <div style={{ position:"relative", width:layout.boardW, height:layout.boardH, margin:"0 auto" }}>
      {layout.sorted.map(function(tile) {
        var x = (tile.col - layout.minCol) * TILE_W + tile.layer * LAYER_OFFSET;
        var y = (tile.row - layout.minRow) * TILE_H - tile.layer * LAYER_OFFSET;
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
  );
}
