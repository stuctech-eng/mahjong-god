var BASE = { char:10, bam:10, circ:10, wind:15, dragon:20, flower:25, season:25 };

export function calculatePoints(tile, combo, skillScore, moveTimeMs) {
  var base     = BASE[tile.suit] || 10;
  var speed    = moveTimeMs < 2000 ? 2.0 : moveTimeMs < 5000 ? 1.5 : 1.0;
  var comboMul = 1 + Math.max(0, combo - 1) * 0.5;
  var diff     = 1 + skillScore / 200;
  return Math.round(base * speed * comboMul * diff);
}

export function buildScoreSummary(score, session, tiles) {
  return {
    score,
    moves:     (session && session.moves)     || 0,
    mistakes:  (session && session.mistakes)  || 0,
    hintsUsed: (session && session.hintsUsed) || 0,
    undosUsed: (session && session.undosUsed) || 0,
    duration:  (session && session.endTime)
               ? Math.round((session.endTime - session.startTime) / 1000) : 0,
    tilesLeft: tiles ? tiles.filter(function(t) { return !t.removed; }).length : 0,
  };
}
