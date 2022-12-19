import React from "react";
import Obj from "./components/Obj";
import { AnimSpecsType } from "./components/styles/Anim";
import { FaceType, GlobalType } from "./components/types";

function App() {
   // face individual styles (over rides global)
   const exampleCss = `border: 2px solid #900;
   color:#900;
   backface-visibility: visible;
   background:rgba(220,22,22,.3);
   text-align:center;
   line-height:5;
   font-family: Arial;`;
   const global: GlobalType = {
      body: "GLOBAL",
   };
   const anim1 = {
      border: "",
      animationPlayState: "paused", //paused|running|initial|inherit;
      degreesHi: -15, // degrees if spin
      degreesLow: 15, // degrees if spin
      delay: 0,
      direction: "normal", //normal altenating reverse
      duration: 5,
      fillMode: "forward", // node forward backward both
      iterationCount: "infinite",
      name: "X360",
      timing: "ease-in-out", // linear ease ease-in-out
   };
   const anim2 = {
      animationPlayState: "running", //paused|running|initial|inherit;
      border: "",
      degreesHi: 15,
      degreesLow: -15,
      delay: 0,
      direction: "normal",
      duration: 18,
      fillMode: "forward",
      iterationCount: "infinite",
      name: "Y360",
      timing: "ease-in-out",
   };

   // face individual styles (over rides global)
   const faces: FaceType[] = [
      {
         name: "back",
         body: "BACK",
         css: exampleCss,
      },
      {
         name: "right",
      },
   ];
   const objProps = {
      width: 150,
      height: 150,
      depth: 150,
      perspectiveOrigin: "50% 50%",
      perspective: 900,
      faces,
      anim1,
      anim2,
      global,
      showCenterDiv: false,
   };
   return (
      <div style={{ padding: 300 }}>
         <Obj {...objProps} />
         <div style={{ padding: 5 }} />
      </div>
   );
}

export default App;
