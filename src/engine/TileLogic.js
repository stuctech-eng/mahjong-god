export function isTileFree(tile, allTiles) {
  if (tile.removed) return false;
  if (isBlockedAbove(tile, allTiles)) return false;
  if (!hasSideOpen(tile, allTiles)) return false;
  return true;
}

export function isBlockedAbove(tile, allTiles) {
  return allTiles.some(function(t) {
    return !t.removed && t.id !== tile.id &&
      t.layer === tile.layer + 1 &&
      Math.abs(t.row - tile.row) < 1 &&
      Math.abs(t.col - tile.col) < 1;
  });
}

export function hasSideOpen(tile, allTiles) {
  var leftBlocked = allTiles.some(function(t) {
    return !t.removed && t.id !== tile.id &&
      t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1;
  });
  var rightBlocked = allTiles.some(function(t) {
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

export function getFreeTiles(tiles) {
  return tiles.filter(function(t) { return !t.removed && isTileFree(t, tiles); });
}

export function getAvailablePairs(tiles) {
  var free = getFreeTiles(tiles);
  var pairs = [];
  for (var i = 0; i < free.length; i++) {
    for (var j = i + 1; j < free.length; j++) {
      if (tilesMatch(free[i], free[j])) pairs.push([free[i], free[j]]);
    }
  }
  return pairs;
}

export function removePair(tiles, id1, id2) {
  return tiles.map(function(t) {
    return (t.id === id1 || t.id === id2) ? Object.assign({}, t, { removed: true }) : t;
  });
}

export function restorePair(tiles, id1, id2) {
  return tiles.map(function(t) {
    return (t.id === id1 || t.id === id2) ? Object.assign({}, t, { removed: false }) : t;
  });
}
