export function getDiff(score) {
  if (score < 25) return { label:"Easy",   color:"#4ade80" };
  if (score < 50) return { label:"Medium", color:"#facc15" };
  if (score < 75) return { label:"Hard",   color:"#fb923c" };
  return               { label:"GOD",    color:"#f87171" };
}

export function blendScore(old, next) {
  return Math.round(old * 0.7 + next * 0.3);
}
