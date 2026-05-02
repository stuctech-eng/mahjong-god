import { useState } from "react";
import { LAYOUTS } from "../data/layouts.js";
import { getDifficultyInfo } from "../analytics/SkillScore.js";

var VERSION = "1.0.0";
var DIFFS = [
  { id:"easy",   label:"Easy",   color:"#4ade80" },
  { id:"medium", label:"Medium", color:"#facc15" },
  { id:"hard",   label:"Hard",   color:"#fb923c" },
  { id:"god",    label:"GOD",    color:"#f87171" },
];
var startBg  = "linear-gradient(135deg,#ff6b00,#cc4400)";
var lostBg   = "linear-gradient(135deg,#dc2626,#7f1d1d)";

export function MainMenu({ skillScore, highScore, displayName, onStart, onContinue, onChangeName, onLeaderboard, onSettings }) {
  var ls = useState("turtle"); var layout     = ls[0]; var setLayout     = ls[1];
  var ds = useState("hard");   var difficulty = ds[0]; var setDifficulty = ds[1];
  var es = useState(false);    var editing    = es[0]; var setEditing    = es[1];
  var ns = useState(displayName); var nameInput = ns[0]; var setNameInput  = ns[1];
  var diff = getDifficultyInfo(skillScore);

  return (
    <div style={s.root}>
      <div style={s.g1} /><div style={s.g2} />
      <div style={s.inner}>
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>M</div>
          <div style={s.logoTitle}>MajGOD</div>
          <div style={s.logoSub}>MAHJONG SOLITAIRE</div>
          <div style={s.version}>v{VERSION}</div>
        </div>
        <div style={s.playerRow}>
          {editing ? (
            <div style={s.editRow}>
              <input style={s.input} value={nameInput} onChange={function(e){setNameInput(e.target.value);}} maxLength={20} autoFocus />
              <button style={s.saveBtn} onClick={function(){if(onChangeName)onChangeName(nameInput);setEditing(false);}}>OK</button>
            </div>
          ) : (
            <div style={s.playerInfo}>
              <span style={s.playerLabel}>SPELER</span>
              <div style={s.playerNameRow}>
                <span style={s.playerName}>{displayName}</span>
                <button style={s.editBtn} onClick={function(){setEditing(true);}}>Wijzigen</button>
              </div>
            </div>
          )}
          <div style={s.highScore}>
            <span style={s.highScoreLabel}>BEST</span>
            <span style={s.highScoreVal}>{highScore.toLocaleString()}</span>
          </div>
        </div>
        <button style={s.startBtn} onClick={function(){onStart(layout,difficulty);}}>
          <span style={s.startBtnText}>START</span>
        </button>
        <button style={s.continueBtn} onClick={onContinue}>DOORGAAN</button>
        <div style={s.sectionLabel}>MOEILIJKHEID</div>
        <div style={s.diffRow}>
          {DIFFS.map(function(d) {
            var active = difficulty === d.id;
            return (
              <button key={d.id} onClick={function(){setDifficulty(d.id);}} style={Object.assign({},s.diffBtn,{
                background:  active ? "rgba(255,107,0,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: active ? d.color : "rgba(255,255,255,0.08)",
                color:       active ? d.color : "rgba(255,255,255,0.4)",
              })}>
                {d.label}
              </button>
            );
          })}
        </div>
        <div style={s.sectionLabel}>LAYOUT</div>
        <div style={s.layoutRow}>
          {Object.values(LAYOUTS).map(function(l) {
            var active = layout === l.id;
            return (
              <button key={l.id} onClick={function(){setLayout(l.id);}} style={Object.assign({},s.layoutBtn,{
                background:  active ? "rgba(0,229,255,0.1)"  : "rgba(255,255,255,0.04)",
                borderColor: active ? "#00e5ff" : "rgba(255,255,255,0.08)",
              })}>
                <span style={{ fontSize:14, fontWeight:700, color: active ? "#00e5ff" : "rgba(255,255,255,0.5)" }}>{l.name}</span>
                <span style={{ fontSize:9, color:"rgba(255,255,255,0.25)", marginTop:2 }}>{l.difficulty}</span>
              </button>
            );
          })}
        </div>
        <div style={s.bottomRow}>
          <button style={s.bottomBtn} onClick={onSettings}>
            <span style={s.bottomIcon}>*</span><span>SETTINGS</span>
          </button>
          <button style={s.bottomBtn} onClick={onLeaderboard}>
            <span style={s.bottomIcon}>T</span><span>LEADERBOARD</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function WinScreen({ score, summary, timerSecs, medal, onRestart, onMenu }) {
  return (
    <div style={s.overlayRoot}>
      <div style={s.g1} />
      <div style={s.resultCard}>
        <div style={{ fontSize:48, fontWeight:900, color:"#ff6b00", marginBottom:4 }}>WIN!</div>
        <div style={{ fontSize:11, letterSpacing:4, color:"rgba(255,255,255,0.3)", marginBottom:16 }}>GEWONNEN</div>
        {medal && <div style={Object.assign({},s.medalBadge,{borderColor:medal.color,color:medal.color})}>{medal.label}</div>}
        <div style={s.resultScore}>{score.toLocaleString()}</div>
        <div style={s.summaryGrid}>
          <SI label="Zetten"  value={summary.moves     || 0} color="#ff6b00" />
          <SI label="Fouten"  value={summary.mistakes  || 0} color="#f87171" />
          <SI label="Hints"   value={summary.hintsUsed || 0} color="#00e5ff" />
          <SI label="Tijd"    value={(summary.duration || 0) + "s"} color="#fff" />
        </div>
        <button style={s.startBtn}    onClick={onRestart}><span style={s.startBtnText}>OPNIEUW</span></button>
        <button style={s.continueBtn} onClick={onMenu}>STARTSCHERM</button>
      </div>
    </div>
  );
}

export function LostScreen({ score, summary, onRestart, onMenu }) {
  return (
    <div style={s.overlayRoot}>
      <div style={s.g2} />
      <div style={s.resultCard}>
        <div style={{ fontSize:48, fontWeight:900, color:"#f87171", marginBottom:4 }}>HELAAS</div>
        <div style={{ fontSize:11, letterSpacing:4, color:"rgba(255,255,255,0.3)", marginBottom:16 }}>GEEN ZETTEN MEER</div>
        <div style={Object.assign({},s.resultScore,{color:"#f87171"})}>{score.toLocaleString()}</div>
        <div style={s.summaryGrid}>
          <SI label="Zetten"     value={summary.moves     || 0} color="#ff6b00" />
          <SI label="Tiles over" value={summary.tilesLeft || 0} color="#f87171" />
        </div>
        <button style={Object.assign({},s.startBtn,{background:lostBg})} onClick={onRestart}><span style={s.startBtnText}>OPNIEUW</span></button>
        <button style={s.continueBtn} onClick={onMenu}>STARTSCHERM</button>
      </div>
    </div>
  );
}

function SI({ label, value, color }) {
  return (
    <div style={s.siItem}>
      <span style={{ fontSize:20, fontWeight:900, color:color }}>{value}</span>
      <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:1, marginTop:2 }}>{label}</span>
    </div>
  );
}

var s = {
  root:          { position:"fixed", inset:0, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto" },
  overlayRoot:   { position:"fixed", inset:0, background:"#000", display:"flex", alignItems:"center", justifyContent:"center" },
  g1:            { position:"fixed", top:"-20%", left:"-10%", width:"70%", height:"70%", background:"radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 },
  g2:            { position:"fixed", bottom:"-20%", right:"-10%", width:"70%", height:"70%", background:"radial-gradient(ellipse,rgba(0,229,255,0.08) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 },
  inner:         { position:"relative", zIndex:1, width:"100%", maxWidth:380, padding:"env(safe-area-inset-top,24px) 24px env(safe-area-inset-bottom,24px)", display:"flex", flexDirection:"column", gap:12 },
  logoWrap:      { textAlign:"center", marginBottom:4 },
  logoIcon:      { fontSize:40, fontWeight:900, color:"#ff6b00", lineHeight:1, marginBottom:4, textShadow:"0 0 30px rgba(255,107,0,0.6)" },
  logoTitle:     { fontSize:48, fontWeight:900, letterSpacing:2, background:"linear-gradient(135deg,#ff6b00,#00e5ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 },
  logoSub:       { fontSize:11, letterSpacing:6, color:"rgba(255,255,255,0.3)", marginTop:6 },
  version:       { fontSize:9, color:"rgba(255,255,255,0.15)", letterSpacing:2, marginTop:4 },
  playerRow:     { display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 16px" },
  playerInfo:    { display:"flex", flexDirection:"column", gap:2 },
  playerLabel:   { fontSize:8, color:"rgba(255,255,255,0.25)", letterSpacing:2 },
  playerNameRow: { display:"flex", alignItems:"center", gap:8 },
  playerName:    { fontSize:15, fontWeight:700, color:"#fff" },
  editBtn:       { background:"transparent", border:"1px solid rgba(0,229,255,0.3)", borderRadius:6, color:"#00e5ff", fontSize:10, padding:"2px 8px", cursor:"pointer", fontFamily:"inherit" },
  editRow:       { display:"flex", gap:6 },
  input:         { flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid #ff6b00", borderRadius:8, color:"#fff", fontSize:14, padding:"6px 10px", outline:"none", fontFamily:"inherit" },
  saveBtn:       { background:"#ff6b00", border:"none", borderRadius:8, color:"#000", fontSize:13, fontWeight:700, padding:"6px 12px", cursor:"pointer", fontFamily:"inherit" },
  highScore:     { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 },
  highScoreLabel:{ fontSize:8, color:"rgba(255,255,255,0.25)", letterSpacing:2 },
  highScoreVal:  { fontSize:20, fontWeight:900, color:"#ff6b00" },
  startBtn:      { background:startBg, border:"none", borderRadius:16, padding:"18px 0", cursor:"pointer", boxShadow:"0 0 40px rgba(255,107,0,0.4)" },
  startBtnText:  { fontSize:18, fontWeight:900, color:"#000", letterSpacing:4 },
  continueBtn:   { background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"14px 0", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:2, cursor:"pointer", fontFamily:"inherit" },
  sectionLabel:  { fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:3, textTransform:"uppercase", marginBottom:-4 },
  diffRow:       { display:"flex", gap:8 },
  diffBtn:       { flex:1, border:"1.5px solid", borderRadius:10, padding:"10px 0", fontSize:11, fontWeight:700, letterSpacing:1, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" },
  layoutRow:     { display:"flex", gap:10 },
  layoutBtn:     { flex:1, border:"1.5px solid", borderRadius:12, padding:"12px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontFamily:"inherit" },
  bottomRow:     { display:"flex", gap:10 },
  bottomBtn:     { flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:1, fontFamily:"inherit" },
  bottomIcon:    { fontSize:18, color:"rgba(255,255,255,0.15)" },
  resultCard:    { position:"relative", zIndex:1, background:"rgba(8,8,12,0.98)", border:"1px solid rgba(255,107,0,0.2)", borderRadius:24, padding:"36px 28px", textAlign:"center", maxWidth:340, width:"90%", color:"#fff" },
  medalBadge:    { border:"2px solid", borderRadius:20, padding:"4px 20px", fontSize:13, fontWeight:900, letterSpacing:3, marginBottom:12, display:"inline-block" },
  resultScore:   { fontSize:40, fontWeight:900, color:"#ff6b00", marginBottom:16 },
  summaryGrid:   { display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:20 },
  siItem:        { display:"flex", flexDirection:"column", alignItems:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"8px 14px", minWidth:64 },
};
