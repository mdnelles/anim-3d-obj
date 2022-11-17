//import { Cuboid,Card } from "anim-3d-obj";

import Obj from "./components/Obj";

function App() {
   const faceprops = {
      front: true,
      back: true,
      left: true,
      right: true,
      top: true,
      top_rear: true,
      top_front: true,
      bottom_rear: true,
      bottom_front: true,
      bottom: true,
   };

   const global: object = {
      // // face individual styles (over rides global)
      css: `
         border: 1px solid #333;
         color:#333;
         backface-visibility: visible;
         text-align:center;
         line-height:10;
         font-family: Arial, Helvetica, sans-serif;
         `,
      body: " ",
   };
   const anim1: object = {
      border: "",
      degreesHi: -15, // degrees if spin
      degreesLow: 15, // degrees if spin
      delay: 0,
      direction: "normal", //normal altenating reverse
      duration: 8,
      fillMode: "forward", // node forward backward both
      iterationCount: "infinite",
      name: "Y360",
      timing: "ease-in-out", // linear ease ease-in-out
   };
   const anim2: object = {
      border: "",
      degreesHi: 15, // degrees if spin
      degreesLow: -15, // degrees if spin
      delay: 0,
      direction: "normal", //normal altenating reverse
      duration: 18,
      fillMode: "forward", // node forward backward both
      iterationCount: "infinite",
      name: "X360",
      timing: "ease-in-out", // linear ease ease-in-out
   };

   const details = `backface-visibility: visible;
   font-size:20px;
   text-align:center;
   font-family: Arial, Helvetica, sans-serif;
   line-height:9;`;

   const custom: object = {
      // face individual styles (over rides global)
      bottom: {
         css: ``,
         body: "BOTTOM",
      },
      front: {
         css: ``,
         body: "FRONT",
      },
      back: {
         css: ``,
         body: "BACK",
      },
      top_rear: {
         css: `${details}
         border:2px solid pink;
         color:pink;
            `,
         body: "TOP-REAR",
      },
      top_front: {
         css: `${details}
         border:2px solid #00F;
         color:#00F;
            `,
         body: "TOP-FRONT",
      },
      top: {
         css: ``,
         body: "TOP",
      },
      left: {
         css: ``,
         body: "LEFT",
      },
      right: {
         css: ``,
         body: "RIGHT",
      },
      bottom_rear: {
         css: `${details}
         border:2px solid #090;
         color: #090;
            `,
         body: "BACK-REAR",
      },
      bottom_front: {
         css: `${details}
         border:2px solid red;
         color:#900;
            `,
         body: "BACK-FRONT",
      },
   };

   return (
      <div style={{ padding: 300 }}>
         <Obj
            width={150}
            height={150}
            depth={150}
            perspectiveOrigin='50% 50%'
            perspective={900}
            zIndex={10}
            custom={custom}
            anim1={anim1}
            anim2={anim2}
            faces={faceprops}
            global={global}
            showCenterDiv={false}
         >
            {}
         </Obj>
         <div style={{ padding: 5 }} />
      </div>
   );
}

export default App;
