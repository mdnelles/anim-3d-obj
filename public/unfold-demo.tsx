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

const faces = [
  { name: "front" as const, body: "1", style: faceStyle("rgba(66,133,244,0.85)") },
  { name: "right" as const, body: "2", style: faceStyle("rgba(234,67,53,0.85)") },
  { name: "back" as const, body: "3", style: faceStyle("rgba(251,188,4,0.85)") },
  { name: "left" as const, body: "4", style: faceStyle("rgba(52,168,83,0.85)") },
];

const checkboxStyle: React.CSSProperties = {
  cursor: "pointer",
  userSelect: "none",
  fontSize: 14,
};

export default function App() {
  const [flat, setFlat] = useState(false);
  const [oneAtATime, setOneAtATime] = useState(false);
  const [remainJoined, setRemainJoined] = useState(false);
  const [ytilt, setYtilt] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        fontFamily: "system-ui, sans-serif",
        color: "#eee",
      }}
    >
      <h2 style={{ margin: 0 }}>anim-3d-obj – Unfold Demo</h2>

      <div style={{ minHeight: 200, display: "flex", alignItems: "center" }}>
        <Obj
          width={120}
          height={120}
          depth={120}
          perspective={800}
          flat={flat}
          transitionDuration={1}
          oneAtATime={oneAtATime}
          remainJoined={remainJoined}
          ytilt={ytilt}
          faces={faces}
          anim1={{
            name: "Y360",
            duration: 6,
            timing: "linear",
            iterationCount: "infinite",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={oneAtATime}
            onChange={(e) => setOneAtATime(e.target.checked)}
          />{" "}
          oneAtATime
        </label>
        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={remainJoined}
            onChange={(e) => setRemainJoined(e.target.checked)}
          />{" "}
          remainJoined
        </label>
        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={ytilt}
            onChange={(e) => setYtilt(e.target.checked)}
          />{" "}
          ytilt
        </label>
      </div>

      <button
        onClick={() => setFlat((f) => !f)}
        style={{
          padding: "10px 32px",
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
