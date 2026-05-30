import { useState } from "react";

export function ComboPopup({ combo }) {
  if (!combo) return null;
  return (
    <div style={{ position:"fixed", top:"38%", left:"50%", zIndex:200,
      pointerEvents:"none", animation:"comboIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
      <div style={{ background:"linear-gradient(135deg,#ffd700,#ff8c00)",
        borderRadius:20, padding:"14px 28px",
        display:"flex", flexDirection:"column", alignItems:"center",
        boxShadow:"0 0 40px rgba(255,215,0,0.7)" }}>
        <span style={{ fontSize:34, fontWeight:900, color:"#000", lineHeight:1 }}>x{combo.count}</span>
        <span style={{ fontSize:13, fontWeight:900, color:"rgba(0,0,0,0.7)", letterSpacing:4 }}>COMBO!</span>
        <span style={{ fontSize:12, color:"rgba(0,0,0,0.6)", fontWeight:700 }}>+{combo.pts} pts</span>
      </div>
    </div>
  );
}

export function PauseMenu({ onResume, onRestart, onMenu, timer, score }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
      zIndex:300, display:"flex", alignItems:"center", justifyContent:"center",
      animation:"overlayIn 0.2s ease-out" }}>
      <div style={{ background:"rgba(12,12,20,0.98)", border:"1px solid rgba(255,215,0,0.2)",
        borderRadius:24, padding:"32px 28px", display:"flex", flexDirection:"column",
        gap:12, minWidth:270, alignItems:"center",
        boxShadow:"0 0 50px rgba(255,215,0,0.1)" }}>
        <div style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:6 }}>PAUZE</div>
        <div style={{ display:"flex", gap:20, marginBottom:6 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:2 }}>SCORE</span>
            <span style={{ fontSize:18, fontWeight:900, color:"#ffd700" }}>{(score||0).toLocaleString()}</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:2 }}>TIJD</span>
            <span style={{ fontSize:18, fontWeight:900, color:"#ffd700" }}>{timer||"00:00"}</span>
          </div>
        </div>
        <OBtn label="DOORGAAN"   onClick={onResume}  primary />
        <OBtn label="HERSTARTEN" onClick={onRestart} />
        <OBtn label="STARTSCHERM" onClick={onMenu}   />
      </div>
    </div>
  );
}

function OBtn({ label, onClick, primary }) {
  return (
    <button onClick={onClick} style={{
      background:   primary ? "linear-gradient(135deg,#ffd700,#cc8800)" : "rgba(255,255,255,0.05)",
      border:       primary ? "none" : "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14,
      padding:      "13px 0",
      fontSize:     13,
      fontWeight:   900,
      color:        primary ? "#000" : "rgba(255,255,255,0.5)",
      letterSpacing:2,
      cursor:       "pointer",
      width:        "100%",
      fontFamily:   "inherit",
    }}>{label}</button>
  );
}

export function SyncDot({ status }) {
  if (status === "ok" || status === "idle") return null;
  return (
    <div style={{ position:"fixed", top:8, right:12, fontSize:10,
      zIndex:99, opacity:0.5,
      color: status === "error" ? "#f87171" : "#64748b" }}>
      {status === "syncing" ? "sync" : "offline"}
    </div>
  );
}
