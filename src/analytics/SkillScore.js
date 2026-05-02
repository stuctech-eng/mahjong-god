export function calculateSkillScore(session) {
  if (!session || session.moves === 0) return 50;
  var total    = session.moves + session.mistakes;
  var accuracy = total > 0 ? Math.round((session.moves / total) * 100) : 100;
  var speed    = Math.max(0, Math.min(100, Math.round(100 - ((session.avgMoveTime - 2000) / 100))));
  var autonomy = Math.max(0, 100 - Math.min(100, session.hintsUsed * 5 + session.undosUsed * 3));
  var raw = accuracy * 0.5 + speed * 0.3 + autonomy * 0.2;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

export function getDifficultyInfo(skillScore) {
  if (skillScore < 25) return { label: "Easy",   color: "#4ade80", desc: "Easy"   };
  if (skillScore < 50) return { label: "Medium", color: "#facc15", desc: "Medium" };
  if (skillScore < 75) return { label: "Hard",   color: "#fb923c", desc: "Hard"   };
  return                      { label: "GOD",    color: "#f87171", desc: "GOD"    };
}

export function blendSkillScore(old, next) {
  return Math.round(old * 0.7 + next * 0.3);
}
