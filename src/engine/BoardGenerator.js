import { getFreePairs } from "./TileLogic.js";

var DEFS = [];
var suits = ["char","bam","circ"];
var s, v, i;
for (s=0;s<suits.length;s++) {
  for (v=1;v<=9;v++) DEFS.push({ suit:suits[s], value:v });
}
for (v=1;v<=4;v++) DEFS.push({ suit:"wind", value:v });
for (v=1;v<=3;v++) DEFS.push({ suit:"dragon", value:v });
for (v=1;v<=4;v++) DEFS.push({ suit:"flower", value:v });
for (v=1;v<=4;v++) DEFS.push({ suit:"season", value:v });

function buildPool() {
  var pool = [];
  for (i=0;i<DEFS.length;i++) {
    var d = DEFS[i];
    var n = (d.suit==="flower"||d.suit==="season") ? 1 : 4;
    var j;
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
  return positions.map(function(pos, i) {
    return {
      id:pos.layer*10000+pos.row*100+pos.col,
      idx:i,
      layer:pos.layer, row:pos.row, col:pos.col,
      suit:pool[i].suit, value:pool[i].value,
      removed:false,
    };
  });
}

export function generateBoard(positions) {
  var best = null;
  var attempt;
  for (attempt=0;attempt<8;attempt++) {
    var tiles = build(positions);
    var pairs = getFreePairs(tiles);
    if (pairs.length > 0) {
      if (!best || pairs.length > getFreePairs(best).length) best = tiles;
    }
  }
  return best || build(positions);
}
