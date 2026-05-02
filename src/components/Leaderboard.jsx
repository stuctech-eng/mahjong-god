import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";

var btnBg = "linear-gradient(135deg,#ff6b00,#cc4400)";

export function Leaderboard({ onClose }) {
  var ss = useState([]);    var scores  = ss[0]; var setScores  = ss[1];
  var ls = useState(true);  var loading = ls[0]; var setLoading = ls[1];
  var es = useState(null);  var error   = es[0]; var setError   = es[1];

  useEffect(function() {
    var q = query(collection(db, "players"), orderBy("highScore", "desc"), limit(10));
    getDocs(q).then(function(snap) {
      var list = [];
      snap.forEach(function(doc) {
        var d = doc.data();
        if (d.highScore && d.highScore > 0) {
          list.push({ name: d.displayName || "Speler", score: d.highScore, games: d.totalGames || 0, wins: d.totalWins || 0 });
        }
      });
      setScores(list);
      setLoading(false);
    }).catch(function() { setError("Kan scores niet laden"); setLoading(false); });
  }, []);

  var medalColors = ["#fbbf24","#94a3b8","#cd7c2f"];

  return (
    <div style={s.root}>
      <div style={s.g1} /><div style={s.g2} />
      <div style={s.inner}>
        <div style={s.header}>
          <div style={s.title}>LEADERBOARD</div>
          <button style={s.closeBtn} onClick={onClose}>X</button>
        </div>
        {loading && <div style={s.status}>Laden...</div>}
        {error   && <div style={s.err}>{error}</div>}
        {!loading && !error && scores.length === 0 && <div style={s.status}>Nog geen scores.</div>}
        {!loading && !error && scores.length > 0 && (
          <div style={s.list}>
            {scores.map(function(item, i) {
              var isTop = i < 3;
              var rc    = isTop ? medalColors[i] : "rgba(255,255,255,0.3)";
              return (
                <div key={i} style={Object.assign({}, s.row, isTop ? s.rowTop : {})}>
                  <div style={Object.assign({}, s.rank, { color:rc, borderColor:rc })}>{i+1}</div>
                  <div style={s.info}>
                    <div style={s.name}>{item.name}</div>
                    <div style={s.sub}>{item.games} games - {item.wins} wins</div>
                  </div>
                  <div style={Object.assign({}, s.scoreVal, { color: isTop ? rc : "#ff6b00" })}>{item.score.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}
        <button style={s.backBtn} onClick={onClose}>TERUG</button>
      </div>
    </div>
  );
}

var s = {
  root:     { position:"fixed", inset:0, background:"#000", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto" },
  g1:       { position:"fixed", top:"-20%", left:"-10%", width:"70%", height:"70%", background:"radial-gradient(ellipse,rgba(255,107,0,0.1) 0%,transparent 70%)", pointerEvents:"none" },
  g2:       { position:"fixed", bottom:"-20%", right:"-10%", width:"70%", height:"70%", background:"radial-gradient(ellipse,rgba(0,229,255,0.07) 0%,transparent 70%)", pointerEvents:"none" },
  inner:    { position:"relative", zIndex:1, width:"100%", maxWidth:400, padding:"env(safe-area-inset-top,24px) 20px env(safe-area-inset-bottom,24px)", display:"flex", flexDirection:"column", gap:16 },
  header:   { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 },
  title:    { fontSize:22, fontWeight:900, color:"#fff", letterSpacing:4 },
  closeBtn: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"rgba(255,255,255,0.5)", width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, fontFamily:"inherit" },
  status:   { textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:14, padding:"40px 0" },
  err:      { textAlign:"center", color:"#f87171", fontSize:13, padding:"40px 0" },
  list:     { display:"flex", flexDirection:"column", gap:8, marginBottom:8 },
  row:      { display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 16px" },
  rowTop:   { background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.2)" },
  rank:     { fontSize:16, fontWeight:900, border:"1.5px solid", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  info:     { flex:1, display:"flex", flexDirection:"column", gap:2 },
  name:     { fontSize:15, fontWeight:700, color:"#fff" },
  sub:      { fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:1 },
  scoreVal: { fontSize:18, fontWeight:900 },
  backBtn:  { background:btnBg, border:"none", borderRadius:14, padding:"15px 0", fontSize:14, fontWeight:900, color:"#000", letterSpacing:3, cursor:"pointer", width:"100%", fontFamily:"inherit" },
};
