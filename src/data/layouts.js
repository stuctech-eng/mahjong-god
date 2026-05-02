function pos(layer, row, col) { return { layer: layer, row: row, col: col }; }

var TURTLE = (function() {
  var p = [];
  [[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],
   [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10],[2,11],
   [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[3,10],[3,11],
   [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[4,10],[4,11],
   [5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],[5,11],
   [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9],[6,10],[6,11],
   [7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9],[7,10],
   [4,-1],[4,12]
  ].forEach(function(rc) { p.push(pos(0, rc[0], rc[1])); });
  [[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],
   [3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],
   [4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],
   [5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9],
   [6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]
  ].forEach(function(rc) { p.push(pos(1, rc[0], rc[1])); });
  [[3,4],[3,5],[3,6],[3,7],[4,4],[4,5],[4,6],[4,7],[5,4],[5,5],[5,6],[5,7]
  ].forEach(function(rc) { p.push(pos(2, rc[0], rc[1])); });
  [[4,5],[4,6],[5,5],[5,6]].forEach(function(rc) { p.push(pos(3, rc[0], rc[1])); });
  p.push(pos(4, 4, 5));
  p.push(pos(4, 5, 5));
  return p.slice(0, 144);
})();

var PYRAMID = (function() {
  var p = [];
  var center = 8;
  for (var r = 0; r < 12; r++) {
    var w = r + 1;
    var start = center - Math.floor(w / 2);
    for (var c = 0; c < w; c++) p.push(pos(0, r, start + c));
  }
  for (var r2 = 1; r2 < 11; r2++) {
    var w2 = r2;
    var start2 = center - Math.floor(w2 / 2);
    for (var c2 = 0; c2 < w2; c2++) p.push(pos(1, r2, start2 + c2));
  }
  for (var r3 = 2; r3 < 10; r3++) {
    var w3 = r3 - 1;
    if (w3 < 1) continue;
    var start3 = center - Math.floor(w3 / 2);
    for (var c3 = 0; c3 < w3; c3++) p.push(pos(2, r3, start3 + c3));
  }
  p.push(pos(3, 5, center));
  p.push(pos(4, 6, center));
  return p.slice(0, 144);
})();

export var LAYOUTS = {
  turtle:  { id: "turtle",  name: "Turtle",  positions: TURTLE,  difficulty: "medium" },
  pyramid: { id: "pyramid", name: "Pyramid", positions: PYRAMID, difficulty: "easy"   },
};
export var DEFAULT_LAYOUT = "turtle";
