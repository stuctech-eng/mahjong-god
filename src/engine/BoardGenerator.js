import { analyzeBoardQuality } from "./Solver.js";

var TILE_DEFS = [
  {suit:"char",value:1},{suit:"char",value:2},{suit:"char",value:3},{suit:"char",value:4},{suit:"char",value:5},
  {suit:"char",value:6},{suit:"char",value:7},{suit:"char",value:8},{suit:"char",value:9},
  {suit:"bam", value:1},{suit:"bam", value:2},{suit:"bam", value:3},{suit:"bam", value:4},{suit:"bam", value:5},
  {suit:"bam", value:6},{suit:"bam", value:7},{suit:"bam", value:8},{suit:"bam", value:9},
  {suit:"circ",value:1},{suit:"circ",value:2},{suit:"circ",value:3},{suit:"circ",value:4},{suit:"circ",value:5},
  {suit:"circ",value:6},{suit:"circ",value:7},{suit:"circ",value:8},{suit:"circ",value:9},
  {suit:"wind",  value:1},{suit:"wind",  value:2},{suit:"wind",  value:3},{suit:"wind",  value:4},
  {suit:"dragon",value:1},{suit:"dragon",value:2},{suit:"dragon",value:3},
  {suit:"flower",value:1},{suit:"flower",value:2},{suit:"flower",value:3},{suit:"flower",value:4},
  {suit:"season",value:1},{suit:"season",value:2},{suit:"season",value:3},{suit:"season",value:4},
];

function buildPool() {
  var pool = [];
  TILE_DEFS.forEach(function(def) {
    var copies = (def.suit === "flower" || def.suit === "season") ? 1 : 4;
    for (var i = 0; i < copies; i++) pool.push(Object.assign({}, def));
  });
  return pool;
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function buildTiles(positions) {
  var pool = shuffle(buildPool());
  return positions.map(function(pos, i) {
    return {
      id: i, layer: pos.layer, row: pos.row, col: pos.col,
      suit: pool[i].suit, value: pool[i].value,
      removed: false,
    };
  });
}

export function generateBoard(positions, skillScore) {
  skillScore = skillScore || 50;
  var best = null;
  var bestScore = -Infinity;
  for (var attempt = 0; attempt < 6; attempt++) {
    var tiles    = buildTiles(positions);
    var analysis = analyzeBoardQuality(tiles);
    if (!analysis.solvable) continue;
    var score;
    if (skillScore < 35)      score = analysis.branchingFactor * 2 - analysis.deadlockRisk * 30;
    else if (skillScore > 65) score = analysis.branchingFactor * 0.5 + analysis.deadlockRisk * 15;
    else                      score = analysis.branchingFactor - analysis.deadlockRisk * 15;
    if (score > bestScore) { bestScore = score; best = tiles; }
  }
  return best || buildTiles(positions);
}
