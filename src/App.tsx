import { Cuboid } from "./anim-3d/components/Cuboid";
import { Ribbon } from "./anim-3d/components/Ribbon";
import { AnimSpecsProps } from "./anim-3d/components/styles/Anim";
//import { Cuboid,Card } from "anim-3d-objs";

function App() {
   const faceprops = {
      front: true,
      back: true,
      left: true,
      right: true,
      top: true,
      bottom: true,
   };

   const global: object = {
      // // face individual styles (over rides global)
      css: `
         border: 1px solid #900;
         background-color: red;
         color:white;
         opacity: 0.7;
         backface-visibility: visible;
         font-family: Arial, Helvetica, sans-serif;
         `,
      body: " ",
   };
   const anim1Specs: object = {
      border: "wobX",
      degreesHi: -45, // degrees if spin
      degreesLow: 45, // degrees if spin
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
      degreesHi: 0, // degrees if spin
      degreesLow: 180, // degrees if spin
      delay: 2,
      direction: "normal", //normal altenating reverse
      duration: 8,
      fillMode: "forward", // node forward backward both
      iterationCount: "infinite",
      name: "Y360",
      timing: "ease-in-out", // linear ease ease-in-out
   };

   const custom: object = {
      // face individual styles (over rides global)
      bottom: {
         css: `
         background-color: #F00;
         opacity: 0.7;
         backface-visibility: visible;
         font-size:30px;
         text-align:center;
         line-height:8;
         color:white;
         `,
         body: " ",
      },
      back: {
         css: `
         background-color: #900;
         opacity: 0.7;
         backface-visibility: visible;
         color:white;         
         font-size:30px;
         text-align:center;
         line-height:8;
         `,
         body: "BACK",
      },
      topr: {
         css: `
         background-color: #500;
         opacity: 0.7;
         backface-visibility: visible;
         font-size:30px;
         text-align:center;
         line-height:8;
         color:white;
            `,
         body: "TOPR",
      },
   };

   return (
      <div style={{ padding: 150 }}>
         <Cuboid
            width={300}
            height={400}
            depth={600}
            perspectiveOrigin='50% 50%'
            perspective={900}
            zIndex={10}
            custom={custom}
            anim1Specs={anim1Specs}
            anim2Specs={anim2Specs}
            faces={faceprops}
            global={global}
         >
            {}
         </Cuboid>
         <div style={{ padding: 5 }} />
      </div>
   );
}

export default App;
