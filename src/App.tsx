//import { Cuboid,Card } from "anim-3d-obj";

import Obj from "./components/Obj";

function App() {
   const faceprops = {
      front: true,
      back: true,
      left: false,
      right: false,
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
         border: 2px solid #333;
         color:#333;
         backface-visibility: visible;
         text-align:center;
         line-height:12;
         font-family: Arial, Helvetica, sans-serif;
         `,
      body: " ",
   };
   const anim1Specs: object = {
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
   const anim2Specs: object = {
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

   const custom: object = {
      // face individual styles (over rides global)
      bottom: {
         css: ``,
         body: "BOTTOM",
      },
      front: {
         css: ``,
         body: "Front",
      },
      back: {
         css: ``,
         body: "BACK",
      },
      top_rear: {
         css: `
         border:2px solid pink;
         backface-visibility: visible;
         font-size:20px;
         text-align:center;
         line-height:9;
         color:pink;
            `,
         body: "T-REAR",
      },
      top_front: {
         css: `
         border:2px solid pink;
         backface-visibility: visible;
         font-size:20px;
         text-align:center;
         line-height:9;
         color:pink;
            `,
         body: "T-FRONT",
      },
      top: {
         css: ``,
         body: "TOP",
      },
      bottom_rear: {
         css: `
         border:2px solid red;
         backface-visibility: visible;
         font-size:20px;
         text-align:center;
         line-height:9;
         color:#900;
            `,
         body: "B-REAR",
      },
      bottom_front: {
         css: `
         border:2px solid red;
         backface-visibility: visible;
         font-size:20px;
         text-align:center;
         line-height:9;
         color:#900;
            `,
         body: "B-FRONT",
      },
   };

   return (
      <div style={{ padding: 300 }}>
         <Obj
            width={100}
            height={210}
            depth={210}
            perspectiveOrigin='50% 50%'
            perspective={900}
            zIndex={10}
            custom={custom}
            anim1Specs={anim1Specs}
            anim2Specs={anim2Specs}
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
