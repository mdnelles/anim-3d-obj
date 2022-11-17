import React from "react";
import { AnimWrap } from "./styles/AnimWrap";
import { SceneStyle } from "./styles/Scene";
import { ObjProps } from "./Face/face";
import Face from "./Face";
import { ObjWrapper } from "./styles/Global";

export const Card = (props: ObjProps): any => {
   let {
      anim1,
      anim2,
      width = 5,
      height = 5,
      faces,
      global = {},
      custom = {},
      tranz = (+height / 2) | 0,
      perspective,
      perspectiveOrigin,
      zIndex,
   } = props;

   const buildFace = (faceType: any): any => {
      return (
         <Face
            width={width}
            height={height}
            depth={0.1}
            faceType={faceType}
            id={faceType}
            tranz={tranz}
            global={global}
            custom={custom}
         />
      );
   };

   return (
      <SceneStyle
         width={width}
         height={height}
         perspective={perspective}
         perspectiveOrigin={perspectiveOrigin}
         zIndex={zIndex}
      >
         <AnimWrap animSpecs={anim1}>
            <AnimWrap animSpecs={anim2}>
               <ObjWrapper>
                  {!!faces && !!faces.front ? buildFace("front") : null}
                  {!!faces && !!faces.back ? buildFace("back") : null}
               </ObjWrapper>
            </AnimWrap>
         </AnimWrap>
      </SceneStyle>
   );
};
