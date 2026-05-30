import { useState } from "react";
import { THEMES, THEME_LIST } from "../systems/Themes.js";

var VERSION = "2.0.0";
var saveBg = "linear-gradient(135deg,#ffd700,#cc8800)";

export function Settings({ displayName, skillScore, onChangeName, onClose, currentTheme, onThemeChange }) {
  var ns = useState(displayName); var name = ns[0]; var setName = ns[1];
  var es = useState(false);       var edit = es[0]; var setEdit = es[1];

  var save = function() {
    if (onChangeName && name.trim()) onChangeName(name.trim());
    setEdit(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#0d1117",
      zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto" }}>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:400,
        padding:"env(safe-area-inset-top,24px) 20px env(safe-area-inset-bottom,24px)",
        display:"flex", flexDirection:"column", gap:16 }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:4 }}>SETTINGS</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.1)", borderRadius:10,
            color:"rgba(255,255,255,0.5)", width:36, height:36, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:700, fontFamily:"inherit" }}>X</button>
        </div>

        <Sec title="ACHTERGROND">
          <div style={{ display:"flex", gap:8 }}>
            {THEME_LIST.map(function(tid) {
              var t = THEMES[tid];
              var active = currentTheme === tid;
              return (
                <button key={tid} onClick={function(){onThemeChange(tid);}} style={{
                  flex:1,
                  background:"linear-gradient(135deg,"+t.bg+","+t.bg+"dd)",
                  border: active ? "2px solid #ffd700" : "2px solid rgba(255,255,255,0.12)",
                  borderRadius:12, padding:"14px 6px", cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                }}>
                  <div style={{ width:22, height:22, borderRadius:11,
                    background:"radial-gradient(circle,"+t.glow1.replace("rgba","rgba").replace(",0.",",0.9,").replace(/,0\.\d+\)/, ")")+","+t.bg+")" }} />
                  <div style={{ fontSize:10, fontWeight:700, color:"#fff", letterSpacing:1 }}>{t.name}</div>
                  {active && <div style={{ width:6, height:6, borderRadius:3, background:"#ffd700" }} />}
                </button>
              );
            })}
          </div>
        </Sec>

        <Sec title="SPELER">
          {edit ? (
            <div style={{ display:"flex", gap:8 }}>
              <input value={name} onChange={function(e){setName(e.target.value);}} maxLength={20}
                autoFocus style={{ flex:1, background:"rgba(255,255,255,0.06)",
                  border:"1px solid #ffd700", borderRadius:8, color:"#fff",
                  fontSize:14, padding:"8px 12px", outline:"none", fontFamily:"inherit" }} />
              <button onClick={save} style={{ background:"#ffd700", border:"none",
                borderRadius:8, color:"#000", fontSize:13, fontWeight:700,
                padding:"8px 14px", cursor:"pointer", fontFamily:"inherit" }}>OK</button>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{displayName}</div>
              <button onClick={function(){setEdit(true);}} style={{ background:"transparent",
                border:"1px solid rgba(255,215,0,0.3)", borderRadius:6,
                color:"#ffd700", fontSize:10, padding:"4px 10px",
                cursor:"pointer", fontFamily:"inherit" }}>Wijzigen</button>
            </div>
          )}
        </Sec>

        <Sec title="SKILL SCORE">
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
            <div style={{ fontSize:26, fontWeight:900, color:"#ffd700", minWidth:44 }}>{skillScore}</div>
            <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:skillScore+"%",
                background:"linear-gradient(90deg,#ffd700,#ff8c00)",
                borderRadius:2, transition:"width 0.4s" }} />
            </div>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>
            Past automatisch aan op basis van je speelstijl
          </div>
        </Sec>

        <Sec title="OVER">
          <Row label="Versie" value={"v"+VERSION} />
          <Row label="App"    value="MajGOD" />
        </Sec>

        <button onClick={onClose} style={{ background:saveBg, border:"none",
          borderRadius:14, padding:"15px 0", fontSize:14, fontWeight:900,
          color:"#000", letterSpacing:3, cursor:"pointer",
          width:"100%", fontFamily:"inherit" }}>SLUITEN</button>
      </div>
    </div>
  );
}

function Sec({ title, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:3, textTransform:"uppercase" }}>{title}</div>
      <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:14, padding:"14px 16px" }}>{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between",
      paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{value}</span>
    </div>
  );
}
