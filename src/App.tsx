//import { Cuboid,Card } from "anim-3d-obj";

import Obj from "./components/Obj";

function App() {
   const faceprops = {
      front: true,
      back: false,
      left: false,
      right: false,
      top: false,
      top_rear: false,
      top_front: false,
      bottom_rear: false,
      bottom_front: false,
      bottom: false,
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
      duration: 5,
      fillMode: "forward", // node forward backward both
      iterationCount: 1,
      name: "swingDecay",
      timing: "ease-in-out", // linear ease ease-in-out
   };
   const anim2: object = {
      border: "",
      degreesHi: 15,
      degreesLow: -15,
      delay: 0,
      direction: "normal",
      duration: 38,
      fillMode: "forward",
      iterationCount: "infinite",
      name: "",
      timing: "ease-in-out",
   };

   const details = `backface-visibility: visible;
   font-size:20px;
   text-align:center;
   font-family: Arial, Helvetica, sans-serif;
   line-height:9;`;

   const custom: object = {
      // face individual styles (over rides global)

      front: {
         css: ``,
         body: "FRONT",
      },
   };

   return (
      <div style={{ padding: 300 }}>
         <Obj
            width={150}
            height={150}
            depth={1}
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
