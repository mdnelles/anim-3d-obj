import * as React from "react";
import type {
   ObjProps,
   FaceDef,
   FaceName,
   GlobalDef,
} from "../types";
import { toAnimationShorthand } from "../keyframes";
import "../styles/obj.css";

// Re-export the canonical ObjProps from types.ts
export type { ObjProps } from "../types";

/* ------------------------------------------------------------------ */
/*  Face transform map                                                 */
/* ------------------------------------------------------------------ */

function faceTransform(
   name: string,
   w: number,
   h: number,
   d: number
): string {
   const hw = w / 2;
   const hh = h / 2;
   const hd = d / 2;

   switch (name as FaceName) {
      case "front":
         return `translate(-50%, -50%) translateZ(${hd}px)`;
      case "back":
         return `translate(-50%, -50%) rotateY(180deg) translateZ(${hd}px)`;
      case "left":
         return `translate(-50%, -50%) rotateY(-90deg) translateZ(${hw}px)`;
      case "right":
         return `translate(-50%, -50%) rotateY(90deg) translateZ(${hw}px)`;
      case "top":
         return `translate(-50%, -50%) rotateX(90deg) translateZ(${hh}px)`;
      case "bottom":
         return `translate(-50%, -50%) rotateX(-90deg) translateZ(${hh}px)`;
      // Legacy names – map to angled half-faces
      case "top_front":
         return `translate(-50%, -50%) rotateX(45deg) translateZ(${hh}px)`;
      case "top_rear":
         return `translate(-50%, -50%) rotateX(135deg) translateZ(${hh}px)`;
      case "bottom_front":
         return `translate(-50%, -50%) rotateX(-45deg) translateZ(${hh}px)`;
      case "bottom_rear":
         return `translate(-50%, -50%) rotateX(-135deg) translateZ(${hh}px)`;
      default:
         return `translate(-50%, -50%) translateZ(${hd}px)`;
   }
}

/* ------------------------------------------------------------------ */
/*  Parse a legacy CSS text string into a CSSProperties object         */
/* ------------------------------------------------------------------ */

function parseCssText(css?: string): React.CSSProperties {
   if (!css) return {};
   const style: Record<string, string> = {};
   css.split(";").forEach((rule) => {
      const [prop, ...rest] = rule.split(":");
      if (!prop || rest.length === 0) return;
      const key = prop
         .trim()
         .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      style[key] = rest.join(":").trim();
   });
   return style as React.CSSProperties;
}

/* ------------------------------------------------------------------ */
/*  Resolve face dimensions for non-standard faces                     */
/* ------------------------------------------------------------------ */

function faceDimensions(
   name: string,
   w: number,
   h: number,
   d: number
): { width: number; height: number } {
   switch (name as FaceName) {
      case "left":
      case "right":
         return { width: d, height: h };
      case "top":
      case "bottom":
      case "top_front":
      case "top_rear":
      case "bottom_front":
      case "bottom_rear":
         return { width: w, height: d };
      default:
         return { width: w, height: h };
   }
}

/* ------------------------------------------------------------------ */
/*  Default 6-sided cube when no faces are provided                    */
/* ------------------------------------------------------------------ */

const DEFAULT_FACE_NAMES: FaceName[] = [
   "front",
   "back",
   "left",
   "right",
   "top",
   "bottom",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Obj: React.FC<ObjProps> = React.memo(
   ({
      width = 160,
      height = 160,
      depth = 150,
      perspective = 600,
      perspectiveOrigin = "50% 50%",
      faces,
      global: globalDef,
      anim1,
      anim2,
      showCenterDiv = false,
      className,
      style,
   }) => {
      const w = typeof width === "number" ? width : parseFloat(width);
      const h = typeof height === "number" ? height : parseFloat(height);
      const d = typeof depth === "number" ? depth : parseFloat(depth);

      // Resolve animation shorthands
      const animation1 = toAnimationShorthand(anim1) ?? undefined;
      const animation2 = toAnimationShorthand(anim2) ?? undefined;

      // Determine which faces to render
      const faceList: FaceDef[] =
         faces && faces.length > 0
            ? faces
            : DEFAULT_FACE_NAMES.map((name) => ({ name }));

      // Merge global defaults into each face
      const renderFace = (face: FaceDef, i: number) => {
         const dims = faceDimensions(face.name, w, h, d);
         const transform = faceTransform(face.name, w, h, d);

         const globalStyle = parseCssText(globalDef?.css);
         const faceInlineStyle = parseCssText(face.css);

         const mergedStyle: React.CSSProperties = {
            ...globalStyle,
            ...(globalDef?.style ?? {}),
            ...faceInlineStyle,
            ...(face.style ?? {}),
            width: dims.width,
            height: dims.height,
            transform,
         };

         const body = face.body ?? globalDef?.body ?? null;
         const faceClassName = [
            "anim3d-face",
            face.className,
         ]
            .filter(Boolean)
            .join(" ");

         return (
            <div
               key={face.name + "-" + i}
               className={faceClassName}
               style={mergedStyle}
            >
               {body}
            </div>
         );
      };

      const cssVars = {
         "--obj-w": w + "px",
         "--obj-h": h + "px",
         "--obj-d": d + "px",
      } as React.CSSProperties;

      return (
         <div
            className={["anim3d-stage", className].filter(Boolean).join(" ")}
            style={{
               perspective,
               perspectiveOrigin,
               ...cssVars,
               ...style,
            }}
            data-anim-3d-obj
            role="img"
            aria-label="3D object"
         >
            {/* Outer animation wrapper (anim1) */}
            <div
               className="anim3d-wrapper"
               style={{
                  ...cssVars,
                  animation: animation1,
                  transformStyle: "preserve-3d",
               }}
            >
               {/* Inner animation wrapper (anim2) */}
               <div
                  className="anim3d-wrapper"
                  style={{
                     ...cssVars,
                     animation: animation2,
                     transformStyle: "preserve-3d",
                  }}
               >
                  {showCenterDiv && <div className="anim3d-center" />}
                  {faceList.map(renderFace)}
               </div>
            </div>
         </div>
      );
   }
);

Obj.displayName = "Obj";
