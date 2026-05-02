function vibe(p) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(p); } catch(e) {}
  }
}
export var Haptics = {
  select:  function()  { vibe([8]); },
  match:   function()  { vibe([12,8,12]); },
  mistake: function()  { vibe([30,15,30]); },
  hint:    function()  { vibe([6,4,6]); },
  undo:    function()  { vibe([10,5,10]); },
  shuffle: function()  { vibe([8,4,8,4,8]); },
  win:     function()  { vibe([40,20,40,20,80]); },
  lose:    function()  { vibe([80,30,80]); },
  combo:   function(n) {
    var p = [];
    var c = Math.min(n, 6);
    for (var i = 0; i < c; i++) { p.push(15 + i*8); if (i < c-1) p.push(6); }
    vibe(p);
  },
};
