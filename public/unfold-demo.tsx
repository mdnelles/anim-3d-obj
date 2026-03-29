import React, { useState } from "react";
import { Obj } from "anim-3d-obj";
import "anim-3d-obj/dist/index.css";

const faceStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  fontSize: "32px",
  fontWeight: "bold",
});

export default function App() {
  const [flat, setFlat] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Obj
        width={120}
        height={120}
        depth={120}
        perspective={800}
        flat={flat}
        transitionDuration={1.2}
        faces={[
          { name: "front", body: "1", style: faceStyle("rgba(66,133,244,0.85)") },
          { name: "right", body: "2", style: faceStyle("rgba(234,67,53,0.85)") },
          { name: "back", body: "3", style: faceStyle("rgba(251,188,4,0.85)") },
          { name: "left", body: "4", style: faceStyle("rgba(52,168,83,0.85)") },
        ]}
        anim1={{
          name: "Y360",
          duration: 6,
          timing: "linear",
          iterationCount: "infinite",
        }}
      />

      <button
        onClick={() => setFlat((f) => !f)}
        style={{
          padding: "10px 28px",
          fontSize: 16,
          border: "1px solid #555",
          borderRadius: 6,
          background: "#2a2a4a",
          color: "#eee",
          cursor: "pointer",
        }}
      >
        {flat ? "Fold" : "Unfold"}
      </button>
    </div>
  );
}
