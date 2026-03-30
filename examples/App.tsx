import React, { useState, useEffect } from "react";

// Lazy-load all .tsx files from pages/
const modules = import.meta.glob("./pages/*.tsx") as Record<
   string,
   () => Promise<{ default: React.ComponentType }>
>;

// Build route map:  "./pages/box_spin1.tsx"  →  "box_spin1"
const routes: Record<string, () => Promise<{ default: React.ComponentType }>> =
   {};
for (const path in modules) {
   const name = path.replace("./pages/", "").replace(".tsx", "");
   routes[name] = modules[path];
}

function getRoute(): string {
   // "/example/box_spin1" → "box_spin1"
   return window.location.pathname.replace(/^\/example\//, "");
}

/** Index page listing all available examples */
function Index() {
   return (
      <div style={{ padding: 40, background: "#111", minHeight: "100vh", color: "#ddd" }}>
         <h1>anim-3d-obj examples</h1>
         <ul>
            {Object.keys(routes)
               .sort()
               .map((name) => (
                  <li key={name} style={{ marginBottom: 8 }}>
                     <a href={`/example/${name}`} style={{ color: "#6cb4ee" }}>{name}</a>
                  </li>
               ))}
         </ul>
      </div>
   );
}

function hexToRgb(hex: string): [number, number, number] {
   const h = hex.replace("#", "");
   return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
   ];
}

function BgPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
   const [open, setOpen] = useState(false);
   const [r, g, b] = hexToRgb(value);

   return (
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: "auto" }}>
         <div
            onClick={() => setOpen((o) => !o)}
            style={{
               display: "flex", alignItems: "center", gap: 8,
               cursor: "pointer", padding: "2px 8px", borderRadius: 4,
               border: "1px solid #555", background: "#2a2a2a",
            }}
         >
            <div style={{
               width: 20, height: 20, borderRadius: 3,
               border: "1px solid #999", background: value,
            }} />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#ccc" }}>
               {value.toUpperCase()}
            </span>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#888" }}>
               rgb({r},{g},{b})
            </span>
         </div>

         {open && (
            <div
               style={{
                  position: "absolute", top: 36, right: 0, background: "#2a2a2a",
                  border: "1px solid #555", borderRadius: 8, padding: 12,
                  zIndex: 100, boxShadow: "0 4px 16px rgba(0,0,0,.5)",
                  width: 240,
               }}
            >
               <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  style={{ width: "100%", height: 140, padding: 0, border: "none", cursor: "pointer", borderRadius: 4 }}
               />
               <div style={{
                  marginTop: 10, display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px", background: "#1a1a1a", borderRadius: 4,
               }}>
                  <div style={{
                     width: 28, height: 28, borderRadius: 4, flexShrink: 0,
                     border: "1px solid #ccc", background: value,
                  }} />
                  <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }}>
                     <div style={{ color: "#ccc" }}>{value.toUpperCase()}</div>
                     <div style={{ color: "#888" }}>rgb({r}, {g}, {b})</div>
                  </div>
               </div>
               <button
                  onClick={() => setOpen(false)}
                  style={{
                     marginTop: 8, width: "100%", padding: "4px 0",
                     border: "1px solid #555", borderRadius: 4,
                     background: "#333", color: "#ccc", cursor: "pointer", fontSize: 12,
                  }}
               >
                  Close
               </button>
            </div>
         )}
      </div>
   );
}

export function App() {
   const [Page, setPage] = useState<React.ComponentType | null>(null);
   const [loading, setLoading] = useState(true);
   const [bg, setBg] = useState(() => localStorage.getItem("examples-bg") || "#111111");
   const route = getRoute();

   const changeBg = (c: string) => {
      setBg(c);
      localStorage.setItem("examples-bg", c);
   };

   useEffect(() => {
      if (!route || !routes[route]) {
         setLoading(false);
         return;
      }
      routes[route]().then((mod) => {
         setPage(() => mod.default);
         setLoading(false);
      });
   }, [route]);

   if (loading) return <div style={{ padding: 40, background: "#111", minHeight: "100vh", color: "#ddd" }}>Loading…</div>;
   if (!route || !routes[route]) return <Index />;
   if (!Page) return <div style={{ padding: 40, background: "#111", minHeight: "100vh", color: "#ddd" }}>Example not found.</div>;

   return (
      <div style={{ minHeight: "100vh", background: bg }}>
         <nav style={{ padding: "8px 16px", background: "#1a1a1a", borderBottom: "1px solid #333", display: "flex", alignItems: "center" }}>
            <a href="/" style={{ color: "#6cb4ee" }}>← All examples</a>
            <span style={{ marginLeft: 16, fontWeight: 600, color: "#ddd" }}>{route}</span>
            <BgPicker value={bg} onChange={changeBg} />
         </nav>
         <Page />
      </div>
   );
}
