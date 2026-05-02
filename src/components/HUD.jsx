import { useState, useEffect } from "react";
import { getDifficultyInfo } from "../analytics/SkillScore.js";

function merge(a, b) { return Object.assign({}, a, b); }

export function HUD({ score, activeTiles, totalTiles, availPairs, skillScore, timerDisplay, onPause, isLandscape }) {
  var diff     = getDifficultyInfo(skillScore);
  var progress = totalTiles > 0 ? ((totalTiles - activeTiles) / totalTiles) * 100 : 0;

  var pulseState = useState(false);
  var pulse = pulseState[0];
  var setPulse = pulseState[1];
  var prevScore = useState(score);
  var setPrevScore = prevScore[1];
  prevScore = prevScore[0];

  useEffect(function() {
    if (score !== prevScore && score > 0) {
      setPulse(true);
      setPrevScore(score);
      var t = setTimeout(function() { setPulse(false); }, 200);
      return function() { clearTimeout(t); };
    }
  }, [score]);

  if (isLandscape) {
    return (
      <div style={ls.sidebar}>
        <div style={ls.scoreLabel}>SCORE</div>
        <div style={merge(ls.scoreValue, { animation: pulse ? "scorePulse 0.2s ease" : "none" })}>
          {score.toLocaleString()}
        </div>
        <div style={ls.divider} />
        <div style={ls.timerLabel}>TIME</div>
        <div style={ls.timerValue}>{timerDisplay}</div>
        <div style={ls.divider} />
        <div style={ls.tilesNum}>{activeTiles}</div>
        <div style={ls.tilesLabel}>tiles</div>
        <div style={ls.bar}><div style={merge(ls.barFill, { width: progress + "%" })} /></div>
        <div style={merge(ls.diffBadge, { borderColor: diff.color, color: diff.color })}>{diff.desc}</div>
      </div>
    );
  }

  return (
    <div style={ps.hud}>
      <div style={ps.scoreBlock}>
        <div style={ps.scoreLabel}>SCORE</div>
        <div style={merge(ps.scoreValue, { animation: pulse ? "scorePulse 0.2s ease" : "none" })}>
          {score.toLocaleString()}
        </div>
      </div>
      <div style={ps.center}>
        <div style={ps.timer}>
          <span style={ps.timerDot}>O</span>
          <span style={ps.timerVal}>{timerDisplay}</span>
        </div>
        <div style={ps.bar}><div style={merge(ps.barFill, { width: progress + "%" })} /></div>
        <div style={ps.pairs}>{availPairs} pairs</div>
      </div>
      <div style={ps.right}>
        <div style={merge(ps.diffBadge, { borderColor: diff.color, color: diff.color })}>{diff.desc}</div>
        <button style={ps.pauseBtn} onClick={onPause}>||</button>
      </div>
    </div>
  );
}

export function ActionBar({ onHint, onUndo, onShuffle, canUndo, isLandscape, onPause }) {
  if (isLandscape) {
    return (
      <div style={ls.actions}>
        <PauseBtn onPause={onPause} />
        <Btn label="HINT"    icon="?" onClick={onHint}    color="#ff6b00" />
        <Btn label="UNDO"    icon="<" onClick={onUndo}    color="#00e5ff" disabled={!canUndo} />
        <Btn label="MIX"     icon="~" onClick={onShuffle} color="#ff6b00" />
      </div>
    );
  }
  return (
    <div style={ps.actionBar}>
      <Btn label="HINT"    icon="?" onClick={onHint}    color="#ff6b00" big />
      <Btn label="UNDO"    icon="<" onClick={onUndo}    color="#00e5ff" disabled={!canUndo} big />
      <Btn label="SHUFFLE" icon="~" onClick={onShuffle} color="#ff6b00" big />
    </div>
  );
}

function PauseBtn({ onPause }) {
  var ps2 = useState(false);
  var pressed = ps2[0];
  var setPressed = ps2[1];
  return (
    <button
      onTouchStart={function() { setPressed(true); }}
      onTouchEnd={function() { setPressed(false); }}
      onClick={onPause}
      style={{
        background:    "rgba(255,255,255,0.06)",
        border:        "1px solid rgba(255,255,255,0.1)",
        borderRadius:  10,
        color:         "#fff",
        fontSize:      12,
        fontWeight:    900,
        width:         48,
        height:        48,
        cursor:        "pointer",
        display:       "flex",
        alignItems:    "center",
        justifyContent:"center",
        letterSpacing: 1,
        transform:     pressed ? "scale(0.92)" : "scale(1)",
        transition:    "transform 0.12s ease",
      }}
    >||</button>
  );
}

function Btn({ label, icon, onClick, disabled, color, big }) {
  var ps3 = useState(false);
  var pressed = ps3[0];
  var setPressed = ps3[1];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onTouchStart={function() { if (!disabled) setPressed(true); }}
      onTouchEnd={function() { setPressed(false); }}
      style={{
        background:    disabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
        border:        "1.5px solid " + (disabled ? "rgba(255,255,255,0.06)" : color + "55"),
        borderRadius:  14,
        color:         disabled ? "rgba(255,255,255,0.2)" : color,
        cursor:        disabled ? "default" : "pointer",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        justifyContent:"center",
        gap:           4,
        padding:       big ? "14px 0" : "10px 0",
        flex:          big ? 1 : "none",
        width:         big ? "auto" : 56,
        minHeight:     big ? 64 : 52,
        fontSize:      10,
        fontWeight:    800,
        letterSpacing: 1.5,
        transform:     pressed ? "scale(0.92)" : "scale(1)",
        transition:    "transform 0.12s ease, box-shadow 0.12s ease",
        boxShadow:     disabled ? "none" : pressed ? "inset 0 0 6px rgba(0,0,0,0.3)" : "0 0 10px " + color + "22",
      }}
    >
      <span style={{ fontSize: big ? 20 : 17, fontWeight:900 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

var ps = {
  hud:        { display:"flex", alignItems:"center", padding:"env(safe-area-inset-top,12px) 16px 10px", background:"rgba(0,0,0,0.95)", borderBottom:"1px solid rgba(255,107,0,0.15)", flexShrink:0, zIndex:20, gap:10 },
  scoreBlock: { display:"flex", flexDirection:"column", minWidth:80 },
  scoreLabel: { fontSize:9, color:"rgba(255,107,0,0.6)", letterSpacing:3, textTransform:"uppercase" },
  scoreValue: { fontSize:26, fontWeight:900, color:"#ff6b00", lineHeight:1 },
  center:     { flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  timer:      { display:"flex", alignItems:"center", gap:5 },
  timerDot:   { fontSize:10, color:"#00e5ff" },
  timerVal:   { fontSize:14, fontWeight:700, color:"#fff", fontVariantNumeric:"tabular-nums" },
  bar:        { width:"100%", maxWidth:130, height:2, background:"rgba(255,255,255,0.08)", borderRadius:1, overflow:"hidden" },
  barFill:    { height:"100%", background:"linear-gradient(90deg,#ff6b00,#00e5ff)", borderRadius:1, transition:"width 0.4s ease" },
  pairs:      { fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:1 },
  right:      { display:"flex", alignItems:"center", gap:8, minWidth:80, justifyContent:"flex-end" },
  diffBadge:  { border:"1px solid", borderRadius:6, padding:"2px 8px", fontSize:9, fontWeight:800, letterSpacing:1 },
  pauseBtn:   { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#fff", width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, letterSpacing:1 },
  actionBar:  { display:"flex", gap:10, padding:"12px 16px env(safe-area-inset-bottom,20px)", background:"rgba(0,0,0,0.95)", borderTop:"1px solid rgba(0,229,255,0.12)", flexShrink:0, zIndex:20 },
};

var ls = {
  sidebar:    { display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"env(safe-area-inset-top,10px) 14px 10px", background:"rgba(0,0,0,0.95)", borderRight:"1px solid rgba(255,107,0,0.15)", minWidth:84, flexShrink:0 },
  scoreLabel: { fontSize:8, color:"rgba(255,107,0,0.6)", letterSpacing:2, textTransform:"uppercase" },
  scoreValue: { fontSize:20, fontWeight:900, color:"#ff6b00", lineHeight:1 },
  timerLabel: { fontSize:8, color:"rgba(0,229,255,0.6)", letterSpacing:2, textTransform:"uppercase" },
  timerValue: { fontSize:14, fontWeight:700, color:"#fff", fontVariantNumeric:"tabular-nums" },
  tilesNum:   { fontSize:18, fontWeight:900, color:"#fff", lineHeight:1 },
  tilesLabel: { fontSize:8, color:"rgba(255,255,255,0.35)" },
  divider:    { width:"100%", height:1, background:"rgba(255,255,255,0.06)" },
  bar:        { width:52, height:2, background:"rgba(255,255,255,0.08)", borderRadius:1, overflow:"hidden" },
  barFill:    { height:"100%", background:"linear-gradient(90deg,#ff6b00,#00e5ff)", borderRadius:1, transition:"width 0.4s ease" },
  diffBadge:  { border:"1px solid", borderRadius:6, padding:"2px 6px", fontSize:8, fontWeight:800, letterSpacing:1 },
  actions:    { display:"flex", flexDirection:"column", gap:8, padding:"env(safe-area-inset-top,10px) env(safe-area-inset-right,14px) 10px 14px", background:"rgba(0,0,0,0.95)", borderLeft:"1px solid rgba(0,229,255,0.1)", minWidth:72, flexShrink:0, alignItems:"center", justifyContent:"center" },
  pauseBtn:   { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#fff", fontSize:12, fontWeight:900, width:48, height:48, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", letterSpacing:1 },
};
