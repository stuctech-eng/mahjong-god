import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";

var btnBg = "linear-gradient(135deg,#ffd700,#cc8800)";

export function Leaderboard({ onClose }) {
  var ss = useState([]); var scores = ss[0]; var setScores = ss[1];
  var ls = useState(true); var loading = ls[0]; var setLoading = ls[1];
  var es = useState(null); var error = es[0]; var setError = es[1];

  useEffect(function() {
    var q = query(collection(db,"players"), orderBy("highScore","desc"), limit(10));
    getDocs(q).then(function(snap) {
      var list = [];
      snap.forEach(function(doc) {
        var d = doc.data();
        if (d.highScore && d.highScore > 0) {
          list.push({ name:d.displayName||"Speler", score:d.highScore,
            games:d.totalGames||0, wins:d.totalWins||0 });
        }
      });
      setScores(list); setLoading(false);
    }).catch(function() { setError("Kan scores niet laden"); setLoading(false); });
  }, []);

  var medals = ["#fbbf24","#94a3b8","#cd7c2f"];

  return (
    <div style={{ position:"fixed", inset:0, background:"#0d1117",
      zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto" }}>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:400,
        padding:"env(safe-area-inset-top,24px) 20px env(safe-area-inset-bottom,24px)",
        display:"flex", flexDirection:"column", gap:16 }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:4 }}>LEADERBOARD</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.1)", borderRadius:10,
            color:"rgba(255,255,255,0.5)", width:36, height:36, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:700, fontFamily:"inherit" }}>X</button>
        </div>

        {loading && <div style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", padding:"40px 0" }}>Laden...</div>}
        {error   && <div style={{ textAlign:"center", color:"#f87171", padding:"40px 0" }}>{error}</div>}
        {!loading && !error && scores.length === 0 && (
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", padding:"40px 0" }}>Nog geen scores.</div>
        )}
        {!loading && !error && scores.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {scores.map(function(item, i) {
              var isTop = i < 3;
              var rc = isTop ? medals[i] : "rgba(255,255,255,0.3)";
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
                  background: isTop ? "rgba(255,215,0,0.07)" : "rgba(255,255,255,0.04)",
                  border:"1px solid " + (isTop ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.07)"),
                  borderRadius:14, padding:"12px 16px" }}>
                  <div style={{ fontSize:16, fontWeight:900, border:"1.5px solid "+rc,
                    borderRadius:8, width:32, height:32,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:rc, flexShrink:0 }}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{item.name}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>
                      {item.games} games - {item.wins} wins
                    </div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color: isTop ? rc : "#ffd700" }}>
                    {item.score.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={onClose} style={{ background:btnBg, border:"none", borderRadius:14,
          padding:"15px 0", fontSize:14, fontWeight:900, color:"#000",
          letterSpacing:3, cursor:"pointer", width:"100%", fontFamily:"inherit" }}>TERUG</button>
      </div>
    </div>
  );
}
