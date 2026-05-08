import { useState } from "react";
import { THEMES, THEME_LIST } from "../systems/Themes.js";

var VERSION = "1.0.0";
var btnBg = "linear-gradient(135deg,#ff6b00,#cc4400)";

export function Settings({ displayName, skillScore, onChangeName, onClose, currentTheme, onThemeChange }) {
  var ns = useState(displayName); var nameInput = ns[0]; var setNameInput = ns[1];
  var es = useState(false);       var editing   = es[0]; var setEditing   = es[1];

  var handleSave = function() {
    if (onChangeName && nameInput.trim()) onChangeName(nameInput.trim());
    setEditing(false);
  };

  return (
    <div style={Object.assign({}, s.root, { background: THEMES[currentTheme] ? THEMES[currentTheme].bg : "#000" })}>
      <div style={s.g1} /><div style={s.g2} />
      <div style={s.inner}>
        <div style={s.header}>
          <div style={s.title}>SETTINGS</div>
          <button style={s.closeBtn} onClick={onClose}>X</button>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>THEMA</div>
          <div style={s.themeGrid}>
            {THEME_LIST.map(function(tid) {
              var t = THEMES[tid];
              var active = currentTheme === tid;
              return (
                <button
                  key={tid}
                  onClick={function() { onThemeChange(tid); }}
                  style={{
                    background:  t.bg,
                    border:      active ? "3px solid " + t.accent1 : "2px solid rgba(255,255,255,0.15)",
                    borderRadius: 14,
                    padding:     "14px 8px",
                    cursor:      "pointer",
                    display:     "flex",
                    flexDirection:"column",
                    alignItems:  "center",
                    gap:         8,
                    flex:        1,
                    transition:  "all 0.15s",
                  }}
                >
                  <div style={{ display:"flex", gap:4 }}>
                    <div style={{ width:16, height:20, background:t.tileFree, border:"2px solid "+t.tileBorder, borderRadius:3 }} />
                    <div style={{ width:16, height:20, background:t.tileFree, border:"2px solid "+t.tileBorder, borderRadius:3 }} />
                  </div>
                  <div style={{ fontSize:10, fontWeight:700, color:t.accent1, letterSpacing:1 }}>{t.name}</div>
                  {active && <div style={{ width:8, height:8, borderRadius:4, background:t.accent1 }} />}
                </button>
              );
            })}
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>SPELER</div>
          <div style={s.card}>
            {editing ? (
              <div style={s.editRow}>
                <input style={s.input} value={nameInput} onChange={function(e){setNameInput(e.target.value);}} maxLength={20} autoFocus />
                <button style={s.saveBtn} onClick={handleSave}>OK</button>
              </div>
            ) : (
              <div style={s.nameRow}>
                <div style={s.nameVal}>{displayName}</div>
                <button style={s.editBtn} onClick={function(){setEditing(true);}}>Wijzigen</button>
              </div>
            )}
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>SKILL SCORE</div>
          <div style={s.card}>
            <div style={s.skillRow}>
              <div style={s.skillNum}>{skillScore}</div>
              <div style={s.skillBar}><div style={Object.assign({},s.skillFill,{width:skillScore+"%"})} /></div>
            </div>
            <div style={s.skillDesc}>Past automatisch aan op basis van je speelstijl</div>
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>OVER</div>
          <div style={s.card}>
            <div style={s.row}><span style={s.rowLabel}>Versie</span><span style={s.rowVal}>v{VERSION}</span></div>
            <div style={s.row}><span style={s.rowLabel}>App</span><span style={s.rowVal}>MajGOD</span></div>
          </div>
        </div>

        <button style={s.backBtn} onClick={onClose}>SLUITEN</button>
      </div>
    </div>
  );
}

var s = {
  root:        { position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto" },
  g1:          { position:"fixed", top:"-20%", left:"-10%", width:"70%", height:"70%", background:"radial-gradient(ellipse,rgba(255,107,0,0.1) 0%,transparent 70%)", pointerEvents:"none" },
  g2:          { position:"fixed", bottom:"-20%", right:"-10%", width:"70%", height:"70%", background:"radial-gradient(ellipse,rgba(0,229,255,0.07) 0%,transparent 70%)", pointerEvents:"none" },
  inner:       { position:"relative", zIndex:1, width:"100%", maxWidth:400, padding:"env(safe-area-inset-top,24px) 20px env(safe-area-inset-bottom,24px)", display:"flex", flexDirection:"column", gap:16 },
  header:      { display:"flex", alignItems:"center", justifyContent:"space-between" },
  title:       { fontSize:22, fontWeight:900, color:"#fff", letterSpacing:4 },
  closeBtn:    { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"rgba(255,255,255,0.5)", width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, fontFamily:"inherit" },
  section:     { display:"flex", flexDirection:"column", gap:8 },
  sectionTitle:{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:3, textTransform:"uppercase" },
  themeGrid:   { display:"flex", gap:8 },
  card:        { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"14px 16px" },
  nameRow:     { display:"flex", alignItems:"center", justifyContent:"space-between" },
  nameVal:     { fontSize:16, fontWeight:700, color:"#fff" },
  editBtn:     { background:"transparent", border:"1px solid rgba(0,229,255,0.3)", borderRadius:6, color:"#00e5ff", fontSize:10, padding:"4px 10px", cursor:"pointer", fontFamily:"inherit" },
  editRow:     { display:"flex", gap:8 },
  input:       { flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid #ff6b00", borderRadius:8, color:"#fff", fontSize:14, padding:"8px 12px", outline:"none", fontFamily:"inherit" },
  saveBtn:     { background:"#ff6b00", border:"none", borderRadius:8, color:"#000", fontSize:13, fontWeight:700, padding:"8px 14px", cursor:"pointer", fontFamily:"inherit" },
  skillRow:    { display:"flex", alignItems:"center", gap:12, marginBottom:6 },
  skillNum:    { fontSize:28, fontWeight:900, color:"#ff6b00", minWidth:48 },
  skillBar:    { flex:1, height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" },
  skillFill:   { height:"100%", background:"linear-gradient(90deg,#ff6b00,#00e5ff)", borderRadius:2, transition:"width 0.4s ease" },
  skillDesc:   { fontSize:11, color:"rgba(255,255,255,0.3)" },
  row:         { display:"flex", justifyContent:"space-between", paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(255,255,255,0.05)" },
  rowLabel:    { fontSize:12, color:"rgba(255,255,255,0.35)" },
  rowVal:      { fontSize:12, fontWeight:700, color:"#fff" },
  backBtn:     { background:btnBg, border:"none", borderRadius:14, padding:"15px 0", fontSize:14, fontWeight:900, color:"#000", letterSpacing:3, cursor:"pointer", width:"100%", fontFamily:"inherit" },
};
