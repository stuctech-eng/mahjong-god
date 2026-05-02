import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function ErrorDisplay({ error }) {
return (
<div style={{ background:"#000", color:"#f87171", padding:24, fontFamily:"monospace", fontSize:13, height:"100%", overflow:"auto" }}>
<div style={{ fontSize:18, fontWeight:900, color:"#ff6b00", marginBottom:16 }}>APP CRASH</div>
<div style={{ marginBottom:8 }}>{error && error.toString()}</div>
<div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>
{error && error.stack}
</div>
</div>
);
}

var container = document.getElementById("root");
var root = createRoot(container);

try {
root.render(
<StrictMode>
<App />
</StrictMode>
);
} catch(e) {
root.render(<ErrorDisplay error={e} />);
}

window.addEventListener("unhandledrejection", function(e) {
root.render(<ErrorDisplay error={e.reason} />);
});

window.addEventListener("error", function(e) {
root.render(<ErrorDisplay error={e.error} />);
});