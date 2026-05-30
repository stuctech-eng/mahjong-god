import { useState } from "react";
import { LAYOUTS } from "../data/layouts.js";
import { getDiff } from "../systems/SkillScore.js";
import { THEMES, THEME_LIST } from "../systems/Themes.js";

var VERSION = "2.0.0";
var DIFFS = [
  { id:"easy",   label:"Easy",   color:"#4ade80" },
  { id:"medium", label:"Medium", color:"#facc15" },
  { id:"hard",   label:"Hard",   color:"#fb923c" },
  { id:"god",    label:"GOD",    color:"#f87171" },
];
var startGrad = "linear-gradient(135deg,#ffd700,#cc8800)";
var lostGrad  = "linear-gradient(135deg,#dc2626,#7f1d1d)";

export function MainMenu({ skillScore, highScore, displayName, onStart, onContinue, onChangeName, onLeaderboard, onSettings, theme }) {
  var ls = useState("turtle"); var layout = ls[0]; var setLayout = ls[1];
  var ds = useState("hard");   var diff   = ds[0]; var setDiff   = ds[1];
  var es = useState(false);    var edit   = es[0]; var setEdit   = es[1];
  var ns = useState(displayName); var name = ns[0]; var setName  = ns[1];

  var bg = theme ? theme.bg : "#0d1117";

  return (
    <div style={{ position:"fixed", inset:0, background:bg,
      display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto" }}>
      <div style={{ position:"fixed", top:"-20%", left:"-10%", width:"60%", height:"60%",
        background:"radial-gradient(ellipse," + (theme ? theme.glow1 : "rgba(255,215,0,0.1)") + " 0%,transparent 70%)",
        pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:380,
        padding:"env(safe-area-inset-top,24px) 24px env(safe-area-inset-bottom,24px)",
        display:"flex", flexDirection:"column", gap:12 }}>

        <div style={{ textAlign:"center", marginBottom:4 }}>
          <div style={{ fontSize:44, fontWeight:900, letterSpacing:2,
            background:"linear-gradient(135deg,#ffd700,#ff8c00)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            MajGOD
          </div>
          <div style={{ fontSize:10, letterSpacing:6, color:"rgba(255,255,255,0.3)", marginTop:4 }}>
            MAHJONG SOLITAIRE
          </div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.15)", marginTop:2 }}>v{VERSION}</div>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:14, padding:"12px 16px" }}>
          {edit ? (
            <div style={{ display:"flex", gap:6, flex:1 }}>
              <input value={name} onChange={function(e){setName(e.target.value);}} maxLength={20}
                autoFocus style={{ flex:1, background:"rgba(255,255,255,0.07)",
                  border:"1px solid #ffd700", borderRadius:8, color:"#fff",
                  fontSize:14, padding:"6px 10px", outline:"none", fontFamily:"inherit" }} />
              <button onClick={function(){if(onChangeName)onChangeName(name);setEdit(false);}}
                style={{ background:"#ffd700", border:"none", borderRadius:8,
                  color:"#000", fontSize:13, fontWeight:700, padding:"6px 12px",
                  cursor:"pointer", fontFamily:"inherit" }}>OK</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:2 }}>SPELER</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{displayName}</span>
                <button onClick={function(){setEdit(true);}}
                  style={{ background:"transparent", border:"1px solid rgba(255,215,0,0.3)",
                    borderRadius:6, color:"#ffd700", fontSize:10, padding:"2px 8px",
                    cursor:"pointer", fontFamily:"inherit" }}>Wijzigen</button>
              </div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:2 }}>BEST</div>
            <div style={{ fontSize:20, fontWeight:900, color:"#ffd700" }}>{highScore.toLocaleString()}</div>
          </div>
        </div>

        <button onClick={function(){onStart(layout,diff);}} style={{ background:startGrad,
          border:"none", borderRadius:16, padding:"17px 0", cursor:"pointer",
          boxShadow:"0 0 30px rgba(255,215,0,0.3)" }}>
          <span style={{ fontSize:17, fontWeight:900, color:"#000", letterSpacing:4 }}>START</span>
        </button>

        <button onClick={onContinue} style={{ background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"13px 0",
          fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)",
          letterSpacing:2, cursor:"pointer", fontFamily:"inherit" }}>DOORGAAN</button>

        <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:3 }}>MOEILIJKHEID</div>
        <div style={{ display:"flex", gap:8 }}>
          {DIFFS.map(function(d) {
            var active = diff === d.id;
            return (
              <button key={d.id} onClick={function(){setDiff(d.id);}} style={{
                flex:1, border:"1.5px solid " + (active ? d.color : "rgba(255,255,255,0.08)"),
                borderRadius:10, padding:"10px 0", fontSize:11, fontWeight:700,
                letterSpacing:1, cursor:"pointer", fontFamily:"inherit",
                background: active ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.04)",
                color: active ? d.color : "rgba(255,255,255,0.4)",
              }}>{d.label}</button>
            );
          })}
        </div>

        <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:3 }}>LAYOUT</div>
        <div style={{ display:"flex", gap:10 }}>
          {Object.values(LAYOUTS).map(function(l) {
            var active = layout === l.id;
            return (
              <button key={l.id} onClick={function(){setLayout(l.id);}} style={{
                flex:1, border:"1.5px solid " + (active ? "#ffd700" : "rgba(255,255,255,0.08)"),
                borderRadius:12, padding:"12px 8px", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                fontFamily:"inherit",
                background: active ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.04)",
              }}>
                <span style={{ fontSize:13, fontWeight:700, color: active ? "#ffd700" : "rgba(255,255,255,0.5)" }}>{l.name}</span>
                <span style={{ fontSize:9, color:"rgba(255,255,255,0.25)" }}>{l.difficulty}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <MBtn icon="*" label="SETTINGS"    onClick={onSettings} />
          <MBtn icon="T" label="LEADERBOARD" onClick={onLeaderboard} />
        </div>

      </div>
    </div>
  );
}

function MBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ flex:1, background:"rgba(255,255,255,0.04)",
      border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 8px",
      cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center",
      gap:4, fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.35)",
      letterSpacing:1, fontFamily:"inherit" }}>
      <span style={{ fontSize:18, color:"rgba(255,255,255,0.15)" }}>{icon}</span>
      {label}
    </button>
  );
}

export function WinScreen({ score, summary, timerSecs, medal, onRestart, onMenu }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"rgba(12,12,20,0.98)", border:"1px solid rgba(255,215,0,0.2)",
        borderRadius:24, padding:"32px 28px", textAlign:"center", maxWidth:320, width:"88%",
        color:"#fff" }}>
        <div style={{ fontSize:44, fontWeight:900, color:"#ffd700" }}>WIN!</div>
        {medal && <div style={{ border:"2px solid "+medal.color, borderRadius:20,
          padding:"3px 18px", fontSize:12, fontWeight:900, color:medal.color,
          letterSpacing:3, display:"inline-block", marginBottom:10 }}>{medal.label}</div>}
        <div style={{ fontSize:36, fontWeight:900, color:"#ffd700", margin:"8px 0 16px" }}>
          {score.toLocaleString()}
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
          <SI label="Zetten"  value={summary.moves     || 0} color="#ffd700" />
          <SI label="Fouten"  value={summary.mistakes  || 0} color="#f87171" />
          <SI label="Hints"   value={summary.hintsUsed || 0} color="#00e5ff" />
          <SI label="Tijd"    value={(summary.duration || 0)+"s"} color="#fff" />
        </div>
        <button onClick={onRestart} style={{ background:startGrad, border:"none", borderRadius:14,
          padding:"14px 0", fontSize:14, fontWeight:900, color:"#000",
          letterSpacing:3, cursor:"pointer", width:"100%", fontFamily:"inherit", marginBottom:8 }}>
          OPNIEUW
        </button>
        <button onClick={onMenu} style={{ background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"13px 0",
          fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)",
          letterSpacing:2, cursor:"pointer", width:"100%", fontFamily:"inherit" }}>
          STARTSCHERM
        </button>
      </div>
    </div>
  );
}

export function LostScreen({ score, summary, onRestart, onMenu }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"rgba(12,12,20,0.98)", border:"1px solid rgba(220,38,38,0.2)",
        borderRadius:24, padding:"32px 28px", textAlign:"center", maxWidth:320, width:"88%",
        color:"#fff" }}>
        <div style={{ fontSize:44, fontWeight:900, color:"#f87171" }}>HELAAS</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:4, marginBottom:12 }}>
          GEEN ZETTEN MEER
        </div>
        <div style={{ fontSize:36, fontWeight:900, color:"#f87171", marginBottom:16 }}>
          {score.toLocaleString()}
        </div>
        <button onClick={onRestart} style={{ background:lostGrad, border:"none", borderRadius:14,
          padding:"14px 0", fontSize:14, fontWeight:900, color:"#fff",
          letterSpacing:3, cursor:"pointer", width:"100%", fontFamily:"inherit", marginBottom:8 }}>
          OPNIEUW
        </button>
        <button onClick={onMenu} style={{ background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"13px 0",
          fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)",
          letterSpacing:2, cursor:"pointer", width:"100%", fontFamily:"inherit" }}>
          STARTSCHERM
        </button>
      </div>
    </div>
  );
}

function SI({ label, value, color }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:10, padding:"8px 12px", minWidth:60 }}>
      <span style={{ fontSize:18, fontWeight:900, color:color }}>{value}</span>
      <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{label}</span>
    </div>
  );
}
