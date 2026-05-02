var ctx = null;

function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, type, dur, vol, delay) {
  var c = getCtx(); if (!c) return;
  delay = delay || 0; vol = vol || 0.25;
  var osc = c.createOscillator();
  var g   = c.createGain();
  osc.connect(g); g.connect(c.destination);
  osc.type = type || "sine";
  osc.frequency.setValueAtTime(freq, c.currentTime + delay);
  g.gain.setValueAtTime(0, c.currentTime + delay);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + dur + 0.05);
}

export var Audio = {
  unlock:  function() { getCtx(); },
  select:  function() { tone(880, "sine", 0.07, 0.12); },
  match:   function() { tone(523,"triangle",0.1,0.2); tone(659,"triangle",0.1,0.18,0.08); tone(784,"triangle",0.15,0.22,0.16); },
  mistake: function() { tone(200,"sawtooth",0.12,0.18); tone(150,"sawtooth",0.1,0.15,0.1); },
  hint:    function() { tone(1047,"sine",0.08,0.15); tone(1319,"sine",0.1,0.12,0.09); },
  undo:    function() { tone(440,"triangle",0.08,0.15); tone(370,"triangle",0.08,0.12,0.07); },
  shuffle: function() { for(var i=0;i<5;i++) tone(300+i*80,"sine",0.06,0.1,i*0.06); },
  win:     function() { var m=[523,659,784,1047,784,1047,1319]; m.forEach(function(f,i){tone(f,"triangle",0.18,0.3,i*0.12);}); },
  lose:    function() { tone(392,"sawtooth",0.18,0.2); tone(330,"sawtooth",0.18,0.18,0.14); tone(262,"sawtooth",0.3,0.22,0.28); },
  pause:   function() { tone(660,"sine",0.07,0.15); tone(440,"sine",0.09,0.12,0.07); },
  combo:   function(n) { var notes=[523,659,784,1047,1319,1568]; var c=Math.min(n,notes.length); for(var i=0;i<c;i++) tone(notes[i],"triangle",0.14,0.28,i*0.1); },
};
