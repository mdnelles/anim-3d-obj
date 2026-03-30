import React, { useState } from "react";
import { Obj } from "anim-3d-obj";
import type { AnimationConfig, FaceChainEffect } from "anim-3d-obj";

const SPIN_OPTIONS: Record<string, AnimationConfig | undefined> = {
   none: undefined,
   Y360: { name: "Y360", duration: 4, iterationCount: "infinite" },
   X360: { name: "X360", duration: 4, iterationCount: "infinite" },
   Z360: { name: "Z360", duration: 4, iterationCount: "infinite" },
   rockY: {
      name: "rockY",
      duration: 3,
      iterationCount: "infinite",
      degreesHi: 25,
      degreesLow: -25,
   },
   rockX: {
      name: "rockX",
      duration: 3,
      iterationCount: "infinite",
      degreesHi: 25,
      degreesLow: -25,
   },
};

const toggleStyle: React.CSSProperties = {
   display: "flex",
   alignItems: "center",
   gap: 8,
   cursor: "pointer",
   userSelect: "none",
   fontSize: 14,
   color: "#ccc",
};

const btnBase: React.CSSProperties = {
   padding: "8px 20px",
   fontSize: 14,
   cursor: "pointer",
   border: "1px solid #555",
   borderRadius: 4,
   background: "#333",
   color: "#ccc",
};

function Toggle({
   label,
   value,
   onChange,
}: {
   label: string;
   value: boolean;
   onChange: (v: boolean) => void;
}) {
   return (
      <label style={toggleStyle}>
         <input
            type='checkbox'
            checked={value}
            onChange={() => onChange(!value)}
         />
         {label}
      </label>
   );
}

export default function CuboidFoldUnfold() {
   const [flat, setFlat] = useState(false);
   const [spin, setSpin] = useState<string>("none");
   const [oneAtATime, setOneAtATime] = useState(false);
   const [remainJoined, setRemainJoined] = useState(true);
   const [backfaceHidden, setBackfaceHidden] = useState(false);

   // Right face default dimensions come from depth × height
   const baseW = 150; // depth
   const baseH = 150; // height
   const [rightW, setRightW] = useState(baseW);
   const [rightH, setRightH] = useState(baseH);
   const [aligned, setAligned] = useState<"none" | "top" | "bottom">("none");
   const hasChain = rightW !== baseW || rightH !== baseH;

   return (
      <div
         style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 41px)",
         }}
      >
         {/* Controls */}
         <div
            style={{
               position: "fixed",
               bottom: 5,
               left: 5,
               zIndex: 200,
               display: "inline-flex",
               flexWrap: "wrap",
               gap: 16,
               alignItems: "center",
               padding: "10px 20px",
               background: "#1a1a1a",
               borderRadius: 6,
               border: "1px solid #333",
            }}
         >
            <button onClick={() => setFlat((f) => !f)} style={btnBase}>
               {flat ? "Fold" : "Unfold"}
            </button>

            <label style={{ ...toggleStyle, gap: 6 }}>
               <span>Spin:</span>
               <select
                  value={spin}
                  onChange={(e) => setSpin(e.target.value)}
                  style={{
                     background: "#333",
                     color: "#ccc",
                     border: "1px solid #bbb",
                     borderRadius: 4,
                     padding: "4px 6px",
                     fontSize: 13,
                  }}
               >
                  {Object.keys(SPIN_OPTIONS).map((k) => (
                     <option key={k} value={k}>
                        {k}
                     </option>
                  ))}
               </select>
            </label>

            <Toggle
               label='One at a time'
               value={oneAtATime}
               onChange={setOneAtATime}
            />
            <Toggle
               label='Keep edges joined'
               value={remainJoined}
               onChange={setRemainJoined}
            />
            <Toggle
               label='Backface hidden'
               value={backfaceHidden}
               onChange={setBackfaceHidden}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#ccc" }}>
               <span>Right:</span>
               <label style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  W
                  <input
                     type="number"
                     value={rightW}
                     onChange={(e) => setRightW(Math.max(1, Number(e.target.value)))}
                     style={{ width: 50, background: "#333", color: "#ccc", border: "1px solid #555", borderRadius: 4, padding: "3px 5px", fontSize: 13 }}
                  />
               </label>
               <label style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  H
                  <input
                     type="number"
                     value={rightH}
                     onChange={(e) => setRightH(Math.max(1, Number(e.target.value)))}
                     style={{ width: 50, background: "#333", color: "#ccc", border: "1px solid #555", borderRadius: 4, padding: "3px 5px", fontSize: 13 }}
                  />
               </label>
               {hasChain && <span style={{ color: "#888", fontSize: 11 }}>({(rightW / baseW).toFixed(2)}x, {(rightH / baseH).toFixed(2)}x)</span>}
               <label style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  Aligned:
                  <select
                     value={aligned}
                     onChange={(e) => setAligned(e.target.value as "none" | "top" | "bottom")}
                     style={{ background: "#333", color: "#ccc", border: "1px solid #555", borderRadius: 4, padding: "3px 5px", fontSize: 13 }}
                  >
                     <option value="none">no</option>
                     <option value="top">top</option>
                     <option value="bottom">bottom</option>
                  </select>
               </label>
            </div>
         </div>

         <div>
            <Obj
               width={150}
               height={150}
               depth={150}
               perspective={900}
               flat={flat}
               transitionDuration={1.2}
               // ytilt
               anim1={SPIN_OPTIONS[spin]}
               oneAtATime={oneAtATime}
               remainJoined={remainJoined}
               backfaceHidden={backfaceHidden}
               chainEffects={
                  hasChain
                     ? [
                          {
                             faceName: "right",
                             scaleX: rightW / baseW,
                             scaleY: rightH / baseH,
                             duration: 1.2,
                             ...(aligned !== "none" ? { keepAligned: aligned } : {}),
                          },
                       ]
                     : []
               }
               global={{
                  style: {
                     background: "rgba(17, 17, 17, 0.5)",
                     color: "#fff",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  },
               }}
               faces={[
                  { name: "front", body: "Front" },
                  //   { name: "back", body: "Back" },
                  //   { name: "left", body: "Left" },
                  { name: "right", body: "Right" },
                  // { name: "top", body: "Top" },
                  // { name: "bottom", body: "Bottom" },
               ]}
            />
         </div>
      </div>
   );
}
