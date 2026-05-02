import { useState } from "react";
import { getFlowMessage } from "../systems/FlowControl.js";

export function ComboPopup({ combo }) {
  if (!combo) return null;
  return (
    <div style={s.comboWrap}>
      <div style={s.comboInner}>
        <span style={s.comboX}>x{combo.count}</span>
        <span style={s.comboLabel}>COMBO!</span>
        <span style={s.comboPoints}>+{combo.pts} pts</span>
      </div>
    </div>
  );
}

export function FlowAlert({ event, isPlaying }) {
  var ds = useState(false); var dismissed = ds[0]; var setDismissed = ds[1];
  var ps = useState(null);  var prev = ps[0];      var setPrev      = ps[1];
  if (event !== prev) { setPrev(event); setDismissed(false); }
  var msg = getFlowMessage(event);
  if (!msg || !isPlaying || dismissed) return null;
  return (
    <div style={s.flowWrap} onClick={function() { setDismissed(true); }}>
      <span style={s.flowText}>{msg}</span>
      <span style={s.flowX}>x</span>
    </div>
  );
}

export function SyncIndicator({ status }) {
  if (status === "ok" || status === "idle") return null;
  return (
    <div style={{ position:"fixed", top:6, right:10, fontSize:10, zIndex:99, opacity:0.5, color: status === "error" ? "#f87171" : "#64748b" }}>
      {status === "syncing" ? "sync" : "offline"}
    </div>
  );
}

export function PauseMenu({ onResume, onRestart, onMenu, timerDisplay, score }) {
  return (
    <div style={s.overlay}>
      <div style={s.bgGlow} />
      <div style={s.card}>
        <div style={s.pauseTitle}>PAUZE</div>
        <div style={s.stats}>
          <div style={s.stat}><span style={s.statLabel}>SCORE</span><span style={s.statVal}>{(score||0).toLocaleString()}</span></div>
          <div style={s.stat}><span style={s.statLabel}>TIJD</span><span style={s.statVal}>{timerDisplay||"00:00"}</span></div>
        </div>
        <button style={s.primaryBtn}   onClick={onResume}>DOORGAAN</button>
        <button style={s.secondaryBtn} onClick={onRestart}>HERSTARTEN</button>
        <button style={s.secondaryBtn} onClick={onMenu}>STARTSCHERM</button>
      </div>
    </div>
  );
}

var s = {
  comboWrap:    { position:"fixed", top:"40%", left:"50%", transform:"translate(-50%,-50%)", zIndex:200, pointerEvents:"none", animation:"comboIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275)" },
  comboInner:   { background:"linear-gradient(135deg,#ff6b00,#ffaa00)", borderRadius:20, padding:"16px 32px", display:"flex", flexDirection:"column", alignItems:"center", boxShadow:"0 0 50px rgba(255,107,0,0.7)" },
  comboX:       { fontSize:36, fontWeight:900, color:"#000", lineHeight:1 },
  comboLabel:   { fontSize:14, fontWeight:900, color:"rgba(0,0,0,0.7)", letterSpacing:4 },
  comboPoints:  { fontSize:13, color:"rgba(0,0,0,0.6)", fontWeight:700, marginTop:2 },
  flowWrap:     { position:"fixed", bottom:110, left:"50%", transform:"translateX(-50%)", zIndex:50, background:"rgba(0,0,0,0.92)", border:"1px solid rgba(0,229,255,0.3)", borderRadius:24, padding:"10px 20px", maxWidth:"82vw", display:"flex", alignItems:"center", gap:10, cursor:"pointer", animation:"fadeInUp 0.25s ease-out" },
  flowText:     { fontSize:12, color:"#00e5ff", letterSpacing:1 },
  flowX:        { fontSize:12, color:"rgba(0,229,255,0.5)", fontWeight:700 },
  overlay:      { position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(16px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", animation:"pauseFadeIn 0.2s ease-out" },
  bgGlow:       { position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:300, height:300, background:"radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 70%)", pointerEvents:"none" },
  card:         { position:"relative", zIndex:1, background:"rgba(8,8,12,0.98)", border:"1px solid rgba(255,107,0,0.25)", borderRadius:24, padding:"36px 28px", display:"flex", flexDirection:"column", gap:12, minWidth:280, alignItems:"center" },
  pauseTitle:   { fontSize:32, fontWeight:900, color:"#fff", letterSpacing:6, marginBottom:4 },
  stats:        { display:"flex", gap:24, marginBottom:8 },
  stat:         { display:"flex", flexDirection:"column", alignItems:"center", gap:2 },
  statLabel:    { fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:2 },
  statVal:      { fontSize:20, fontWeight:900, color:"#ff6b00" },
  primaryBtn:   { background:"linear-gradient(135deg,#ff6b00,#cc4400)", border:"none", borderRadius:14, padding:"15px 0", fontSize:15, fontWeight:900, color:"#000", letterSpacing:3, cursor:"pointer", width:"100%", fontFamily:"inherit" },
  secondaryBtn: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:"13px 0", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.45)", letterSpacing:2, cursor:"pointer", width:"100%", fontFamily:"inherit" },
};
