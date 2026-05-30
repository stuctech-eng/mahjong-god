export function isTileFree(tile, all) {
  if (tile.removed) return false;
  var blockedAbove = all.some(function(t) {
    return !t.removed && t.id !== tile.id &&
      t.layer === tile.layer + 1 &&
      Math.abs(t.row - tile.row) < 1 &&
      Math.abs(t.col - tile.col) < 1;
  });
  if (blockedAbove) return false;
  var leftBlocked = all.some(function(t) {
    return !t.removed && t.id !== tile.id &&
      t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1;
  });
  var rightBlocked = all.some(function(t) {
    return !t.removed && t.id !== tile.id &&
      t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 1;
  });
  return !leftBlocked || !rightBlocked;
}

export function tilesMatch(a, b) {
  if (!a || !b || a.id === b.id) return false;
  if (a.suit === "flower" && b.suit === "flower") return true;
  if (a.suit === "season" && b.suit === "season") return true;
  return a.suit === b.suit && a.value === b.value;
}

export function getFreePairs(tiles) {
  var free = tiles.filter(function(t) {
    return !t.removed && isTileFree(t, tiles);
  });
  var pairs = [];
  var i, j;
  for (i=0;i<free.length;i++) {
    for (j=i+1;j<free.length;j++) {
      if (tilesMatch(free[i], free[j])) pairs.push([free[i], free[j]]);
    }
  }
  return pairs;
}

export function removePair(tiles, id1, id2) {
  return tiles.map(function(t) {
    if (t.id === id1 || t.id === id2) return Object.assign({}, t, { removed:true });
    return t;
  });
}

export function restorePair(tiles, id1, id2) {
  return tiles.map(function(t) {
    if (t.id === id1 || t.id === id2) return Object.assign({}, t, { removed:false });
    return t;
  });
}
