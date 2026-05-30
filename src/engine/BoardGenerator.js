import { getFreePairs } from "./TileLogic.js";

var DEFS = [];
var suits = ["char","bam","circ"];
var s, v;
for (s=0;s<suits.length;s++) {
  for (v=1;v<=9;v++) DEFS.push({ suit:suits[s], value:v });
}
for (v=1;v<=4;v++) DEFS.push({ suit:"wind",   value:v });
for (v=1;v<=3;v++) DEFS.push({ suit:"dragon", value:v });
for (v=1;v<=4;v++) DEFS.push({ suit:"flower", value:v });
for (v=1;v<=4;v++) DEFS.push({ suit:"season", value:v });

function buildPool() {
  var pool = [];
  var i, d, n, j;
  for (i=0;i<DEFS.length;i++) {
    d = DEFS[i];
    n = (d.suit==="flower"||d.suit==="season") ? 1 : 4;
    for (j=0;j<n;j++) pool.push({ suit:d.suit, value:d.value });
  }
  return pool;
}

function shuffle(arr) {
  var i, j, t;
  for (i=arr.length-1;i>0;i--) {
    j = Math.floor(Math.random()*(i+1));
    t=arr[i]; arr[i]=arr[j]; arr[j]=t;
  }
  return arr;
}

function build(positions) {
  var pool = shuffle(buildPool());
  return positions.map(function(pos, idx) {
    return {
      id:      idx,
      layer:   pos.layer,
      row:     pos.row,
      col:     pos.col,
      suit:    pool[idx].suit,
      value:   pool[idx].value,
      removed: false,
    };
  });
}

export function generateBoard(positions) {
  var best = null;
  var attempt, tiles, pairs;
  for (attempt=0;attempt<8;attempt++) {
    tiles = build(positions);
    pairs = getFreePairs(tiles);
    if (pairs.length > 0) {
      if (!best || pairs.length > getFreePairs(best).length) best = tiles;
    }
  }
  return best || build(positions);
}
