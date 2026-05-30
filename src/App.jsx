import { useState, useEffect } from "react";

export default function App() {
  var err = useState(null); var error = err[0]; var setError = err[1];
  var msg = useState("laden..."); var message = msg[0]; var setMessage = msg[1];

  useEffect(function() {
    try {
      var test = {};
      test.ok = true;
      setMessage("React OK");
    } catch(e) {
      setError(e.toString());
    }
  }, []);

  if (error) {
    return (
      <div style={{ background:"#000", color:"#f87171", padding:24, fontFamily:"monospace", fontSize:13, height:"100%", overflow:"auto" }}>
        <div style={{ fontSize:18, fontWeight:900, color:"#ff6b00", marginBottom:16 }}>CRASH</div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ background:"#0d1117", color:"#ffd700", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ fontSize:44, fontWeight:900 }}>MajGOD</div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)" }}>{message}</div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>v2.0.0</div>
    </div>
  );
}
