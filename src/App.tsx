import { Ribbon } from "./components/Ribbon";
//import { Cuboid,Card } from "anim-3d-obj";

function App() {
   const faceprops = {
      front: true,
      back: true,
      left: true,
      right: true,
      top: true,
      bottom: true,
   };

   const Example90 = () => {
      return <div style={{ color: "red" }}>SOME LONG TEXT OVER HERE</div>;
   };

   const global: object = {
      // // face individual styles (over rides global)
      css: `
         border: 1px solid #090;
         background-color: red;
         color:white;
         opacity: 0.7;
         backface-visibility: visible;
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
      name: "wobY",
      timing: "ease-in-out", // linear ease ease-in-out
   };
   const anim2Specs: object = {
      border: "",
      degreesHi: 15, // degrees if spin
      degreesLow: -15, // degrees if spin
      delay: 0,
      direction: "normal", //normal altenating reverse
      duration: 28,
      fillMode: "forward", // node forward backward both
      iterationCount: "infinite",
      name: "wobX",
      timing: "ease-in-out", // linear ease ease-in-out
   };

   const custom: object = {
      // face individual styles (over rides global)
      bottom: {
         css: `
         background:rgba(0,220,0,.5);
         backface-visibility: visible;
         font-size:30px;
         text-align:center;
         line-height:8;
         color:white;
         `,
         body: <Example90 />,
      },
      back: {
         css: `
         margin-bottom:10px;
         background:rgba(220,0,0,.5);
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
         background:rgba(22,22,22,.5);
         backface-visibility: visible;
         font-size:30px;
         text-align:center;
         line-height:8;
         color:white;
            `,
         body: <Example90 />,
      },
   };

   return (
      <div style={{ padding: 150 }}>
         <Ribbon
            width={100}
            height={550}
            depth={1250}
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
         </Ribbon>
         <div style={{ padding: 5 }} />
      </div>
   );
}

export default App;
