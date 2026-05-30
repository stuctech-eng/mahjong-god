import { useState, useEffect } from "react";
import { getDiff } from "../systems/SkillScore.js";

function merge(a,b) { return Object.assign({},a,b); }

export function HUD({ score, activeTiles, totalTiles, availPairs, skillScore, timer, onPause, landscape, theme }) {
  var diff = getDiff(skillScore);
  var pct  = totalTiles > 0 ? ((totalTiles - activeTiles) / totalTiles) * 100 : 0;

  var pulseState = useState(false); var pulse = pulseState[0]; var setPulse = pulseState[1];
  var prevState  = useState(0);    var prev  = prevState[0];  var setPrev  = prevState[1];

  useEffect(function() {
    if (score !== prev && score > 0) {
      setPulse(true); setPrev(score);
      var t = setTimeout(function() { setPulse(false); }, 200);
      return function() { clearTimeout(t); };
    }
  }, [score]);

  var hudBg = theme ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.9)";

  if (landscape) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10,
        padding:"env(safe-area-inset-top,12px) 14px 12px",
        background:hudBg, borderRight:"1px solid rgba(255,255,255,0.08)",
        minWidth:80, flexShrink:0 }}>
        <div style={{ fontSize:8, color:"rgba(255,215,0,0.6)", letterSpacing:2 }}>SCORE</div>
        <div style={{ fontSize:20, fontWeight:900, color:"#ffd700",
          animation: pulse ? "none" : "none",
          transform: pulse ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.2s ease" }}>
          {score.toLocaleString()}
        </div>
        <div style={{ width:"100%", height:1, background:"rgba(255,255,255,0.08)" }} />
        <div style={{ fontSize:8, color:"rgba(255,255,255,0.4)", letterSpacing:2 }}>TIME</div>
        <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{timer}</div>
        <div style={{ width:"100%", height:1, background:"rgba(255,255,255,0.08)" }} />
        <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>{activeTiles}</div>
        <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)" }}>tiles</div>
        <div style={{ width:52, height:2, background:"rgba(255,255,255,0.1)", borderRadius:1, overflow:"hidden" }}>
          <div style={{ height:"100%", width:pct+"%", background:"linear-gradient(90deg,#ffd700,#ff6b00)", transition:"width 0.4s" }} />
        </div>
        <div style={{ border:"1px solid "+diff.color, borderRadius:6, padding:"2px 6px",
          fontSize:8, fontWeight:800, color:diff.color }}>{diff.label}</div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10,
      padding:"env(safe-area-inset-top,12px) 16px 10px",
      background:hudBg, borderBottom:"1px solid rgba(255,255,255,0.08)",
      flexShrink:0, zIndex:20 }}>
      <div style={{ display:"flex", flexDirection:"column", minWidth:80 }}>
        <div style={{ fontSize:8, color:"rgba(255,215,0,0.6)", letterSpacing:3 }}>SCORE</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#ffd700",
          transform: pulse ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.2s ease" }}>
          {score.toLocaleString()}
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{timer}</div>
        <div style={{ width:"100%", maxWidth:120, height:2, background:"rgba(255,255,255,0.1)", borderRadius:1, overflow:"hidden" }}>
          <div style={{ height:"100%", width:pct+"%", background:"linear-gradient(90deg,#ffd700,#ff6b00)", transition:"width 0.4s" }} />
        </div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{availPairs} pairs</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ border:"1px solid "+diff.color, borderRadius:6, padding:"2px 8px",
          fontSize:9, fontWeight:800, color:diff.color }}>{diff.label}</div>
        <button onClick={onPause} style={{ background:"rgba(255,255,255,0.08)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:10,
          color:"#fff", width:34, height:34, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:11, fontWeight:900 }}>||</button>
      </div>
    </div>
  );
}

export function ActionBar({ onHint, onUndo, onShuffle, canUndo, landscape, onPause }) {
  if (landscape) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:8,
        padding:"env(safe-area-inset-top,12px) env(safe-area-inset-right,14px) 12px 14px",
        background:"rgba(0,0,0,0.88)", borderLeft:"1px solid rgba(255,255,255,0.08)",
        minWidth:70, flexShrink:0, alignItems:"center", justifyContent:"center" }}>
        <Btn icon="||" label="" onClick={onPause} color="#ffffff" small />
        <Btn icon="?" label="HINT" onClick={onHint} color="#ffd700" small />
        <Btn icon="<" label="UNDO" onClick={onUndo} color="#00e5ff" disabled={!canUndo} small />
        <Btn icon="~" label="MIX"  onClick={onShuffle} color="#ffd700" small />
      </div>
    );
  }
  return (
    <div style={{ display:"flex", gap:10,
      padding:"12px 16px env(safe-area-inset-bottom,20px)",
      background:"rgba(0,0,0,0.88)", borderTop:"1px solid rgba(255,255,255,0.08)",
      flexShrink:0, zIndex:20 }}>
      <Btn icon="?" label="HINT"    onClick={onHint}    color="#ffd700" />
      <Btn icon="<" label="UNDO"    onClick={onUndo}    color="#00e5ff" disabled={!canUndo} />
      <Btn icon="~" label="SHUFFLE" onClick={onShuffle} color="#ffd700" />
    </div>
  );
}

function Btn({ icon, label, onClick, disabled, color, small }) {
  var ps = useState(false); var pressed = ps[0]; var setPressed = ps[1];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onTouchStart={function() { if (!disabled) setPressed(true); }}
      onTouchEnd={function() { setPressed(false); }}
      style={{
        background:     disabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
        border:         "1.5px solid " + (disabled ? "rgba(255,255,255,0.06)" : color + "44"),
        borderRadius:   small ? 12 : 14,
        color:          disabled ? "rgba(255,255,255,0.2)" : color,
        cursor:         disabled ? "default" : "pointer",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            3,
        padding:        small ? "8px 0" : "13px 0",
        flex:           small ? "none" : 1,
        width:          small ? 52 : "auto",
        minHeight:      small ? 44 : 58,
        fontSize:       9,
        fontWeight:     800,
        letterSpacing:  1.5,
        transform:      pressed ? "scale(0.92)" : "scale(1)",
        transition:     "transform 0.1s ease",
        boxShadow:      disabled ? "none" : "0 0 8px " + color + "22",
      }}
    >
      <span style={{ fontSize: small ? 15 : 18, fontWeight:900 }}>{icon}</span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}
