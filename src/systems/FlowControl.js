export var FLOW_EVENTS = {
  STUCK_INACTIVE: "stuck_inactive",
  STUCK_MISTAKES: "stuck_mistakes",
  NO_MOVES:       "no_moves",
  LOW_PAIRS:      "low_pairs",
};

export function evaluateFlow(analytics, pairsLeft) {
  if (pairsLeft === 0) return FLOW_EVENTS.NO_MOVES;
  if (pairsLeft <= 2)  return FLOW_EVENTS.LOW_PAIRS;
  if (analytics && analytics.isStuck()) {
    return analytics.consecutiveMistakes >= 3
      ? FLOW_EVENTS.STUCK_MISTAKES
      : FLOW_EVENTS.STUCK_INACTIVE;
  }
  return null;
}

export function getFlowMessage(event) {
  var map = {
    stuck_inactive: "Hint beschikbaar!",
    stuck_mistakes: "Probeer een andere aanpak",
    low_pairs:      "Nog maar weinig paren over!",
    no_moves:       "Geen zetten meer - shuffle?",
  };
  return map[event] || null;
}
