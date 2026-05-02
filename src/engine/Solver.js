import { getAvailablePairs } from "./TileLogic.js";

export function quickSolve(tiles, depth) {
  depth = depth || 0;
  if (depth > 400) return false;
  var active = tiles.filter(function(t) { return !t.removed; });
  if (active.length === 0) return true;
  var pairs = getAvailablePairs(tiles);
  if (pairs.length === 0) return false;
  var pick = pairs[Math.floor(Math.random() * pairs.length)];
  pick[0].removed = true;
  pick[1].removed = true;
  return quickSolve(tiles, depth + 1);
}

export function analyzeBoardQuality(tiles) {
  var pairs = getAvailablePairs(tiles);
  if (pairs.length === 0) return { solvable: false, branchingFactor: 0, deadlockRisk: 1 };
  var solved = 0;
  for (var i = 0; i < 8; i++) {
    var copy = tiles.map(function(t) { return Object.assign({}, t); });
    if (quickSolve(copy)) solved++;
  }
  return {
    solvable:        solved > 0,
    branchingFactor: pairs.length,
    deadlockRisk:    1 - (solved / 8),
  };
}
