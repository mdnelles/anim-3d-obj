import React from "react";
import { Obj } from "anim-3d-obj";

export default function BoxSpin1() {
   return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
         <Obj
            width={200}
            height={200}
            depth={200}
            perspective={800}
            anim1={{ name: "Y360", duration: 4, iterationCount: "infinite" }}
            faces={[
               { name: "front", body: "Front", style: { background: "rgba(255,0,0,0.7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } },
               { name: "back", body: "Back", style: { background: "rgba(0,128,0,0.7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } },
               { name: "left", body: "Left", style: { background: "rgba(0,0,255,0.7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } },
               { name: "right", body: "Right", style: { background: "rgba(255,165,0,0.7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } },
               { name: "top", body: "Top", style: { background: "rgba(128,0,128,0.7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } },
               { name: "bottom", body: "Bottom", style: { background: "rgba(255,255,0,0.7)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center" } },
            ]}
         />
      </div>
   );
}
