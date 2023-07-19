import Obj from "./components/Obj";

function App() {
   // face individual styles (over rides global)
   const global = {
      css: 'border: 1px solid #00f; color:#00f; backface-visibility: visible; text-align:center; line-height:10; font-family: "Arial, Helvetica, sans-serif;"',
      body: "DEFAULT",
   };
   const anim1 = {
      border: "",
      degreesHi: -15,
      degreesLow: 15,
      delay: 0,
      direction: "normal",
      duration: 15,
      fillMode: "forwards",
      iterationCount: "infinite",
      name: "Y360",
      animationPlayState: "running",
      timing: "linear",
   };
   const anim2 = {
      border: "",
      degreesHi: 15,
      degreesLow: -15,
      delay: 0,
      direction: "normal",
      duration: 8,
      fillMode: "forwards",
      animationPlayState: "running",
      iterationCount: "infinite",
      name: "X360",
      timing: "ease-in-out",
   };

   // face individual styles (over rides global)
   const faces = [
      {
         name: "front",
         css: "border: 1px solid #F00; color:#F00; text-align:center; line-height:10;",
         body: "FRONT",
      },
      {
         name: "back",
         css: "border: 1px solid #00f; color:#00f; text-align:center; line-height:10;",
         body: "Back",
      },
      {
         name: "left",
         css: "border: 1px solid #00F; color:#00F; text-align:center; line-height:10;",
         body: "Left",
      },
      {
         name: "right",
         css: "border: 1px solid #F00; color:#F00; text-align:center; line-height:10;",
         body: "Right",
      },
      {
         name: "top",
         css: "border: 1px solid #eb9b34; color:#eb9b34; text-align:center; line-height:10;",
         body: "Top",
      },
      {
         name: "top_rear",
         css: "border: 1px solid #118f7c; color:#118f7c; text-align:center; line-height:10;",
         body: "Top Rear",
      },
      {
         name: "top_front",
         css: "border: 1px solid #a31492; color:#a31492; text-align:center; line-height:10;",
         body: "Top Front",
      },
      {
         name: "bottom_rear",
         css: "border: 1px solid #97a314; color:#97a314; text-align:center; line-height:10;",
         body: "Bottom Rear",
      },
      {
         name: "bottom_front",
         css: "border: 1px solid #453721; color:#453721; text-align:center; line-height:10;",
         body: "Bottom Front",
      },
      {
         name: "bottom",
         css: "border: 1px solid #212f45; color:#212f45; text-align:center; line-height:10;",
         body: "Bottom",
      },
   ];

   const objProps = {
      width: 160,
      height: 160,
      depth: 150,
      perspectiveOrigin: "50% 50%",
      perspective: 500,
      faces,
      anim1,
      anim2,
      global,
      showCenterDiv: false,
   };

   return (
      <div style={{ padding: 150 }}>
         <Obj {...objProps} />
         <div style={{ padding: 5 }} />
      </div>
   );
}

export default App;
