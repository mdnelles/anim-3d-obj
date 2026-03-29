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
/*  Face transform — 3D cuboid positions                               */
/* ------------------------------------------------------------------ */

function faceTransform3D(
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
/*  Face transform — flat (unfolded) positions                         */
/*                                                                     */
/*  Flat order:  front | right | back | left                           */
/*  Centred on the midpoint of the full row.                           */
/* ------------------------------------------------------------------ */

function faceTransformFlat(
   name: string,
   w: number,
   h: number,
   d: number
): string {
   // Row layout (left to right): front(w) | right(d) | back(w) | left(d)
   // Total width = 2w + 2d.  Centre of row at (w + d).
   const total = 2 * w + 2 * d;
   const half = total / 2;

   let cx: number;

   switch (name as FaceName) {
      case "front":
         cx = w / 2;
         break;
      case "right":
         cx = w + d / 2;
         break;
      case "back":
         cx = w + d + w / 2;
         break;
      case "left":
         cx = w + d + w + d / 2;
         break;
      case "top":
      case "top_front":
      case "top_rear":
         cx = w / 2;
         return `translate(-50%, -50%) translateX(${cx - half}px) translateY(-${h}px)`;
      case "bottom":
      case "bottom_front":
      case "bottom_rear":
         cx = w / 2;
         return `translate(-50%, -50%) translateX(${cx - half}px) translateY(${h}px)`;
      default:
         cx = w / 2;
         break;
   }

   return `translate(-50%, -50%) translateX(${cx - half}px)`;
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
/*  Build appearance style for a face (colours, borders, etc.)         */
/*  Does NOT include position / transform / size.                      */
/* ------------------------------------------------------------------ */

function faceAppearance(
   face: FaceDef,
   globalDef?: GlobalDef
): {
   style: React.CSSProperties;
   className: string;
   body: React.ReactNode;
} {
   const globalStyle = parseCssText(globalDef?.css);
   const faceInlineStyle = parseCssText(face.css);

   const style: React.CSSProperties = {
      ...globalStyle,
      ...(globalDef?.style ?? {}),
      ...faceInlineStyle,
      ...(face.style ?? {}),
   };

   const className = ["anim3d-face", face.className]
      .filter(Boolean)
      .join(" ");

   const body = face.body ?? globalDef?.body ?? null;

   return { style, className, body };
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
/*  Stagger order for oneAtATime (standard mode)                       */
/* ------------------------------------------------------------------ */

const STAGGER_ORDER: string[] = [
   "front",
   "right",
   "back",
   "left",
   "top",
   "bottom",
   "top_front",
   "top_rear",
   "bottom_front",
   "bottom_rear",
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
      flat = false,
      transitionDuration = 1,
      oneAtATime = false,
      remainJoined = false,
      className,
      style,
   }) => {
      const w =
         typeof width === "number" ? width : parseFloat(String(width));
      const h =
         typeof height === "number" ? height : parseFloat(String(height));
      const d =
         typeof depth === "number" ? depth : parseFloat(String(depth));

      // Resolve animation shorthands
      const animation1 = toAnimationShorthand(anim1) ?? undefined;
      const animation2 = toAnimationShorthand(anim2) ?? undefined;

      // Determine which faces to render
      const faceList: FaceDef[] =
         faces && faces.length > 0
            ? faces
            : DEFAULT_FACE_NAMES.map((name) => ({ name }));

      const transitionCss = (delay = 0) =>
         `transform ${transitionDuration}s ease-in-out ${delay}s`;

      /* ============================================================ */
      /*  Standard rendering (no remainJoined)                         */
      /* ============================================================ */

      const renderStandard = () =>
         faceList.map((face, i) => {
            const dims = faceDimensions(face.name, w, h, d);
            const transform = flat
               ? faceTransformFlat(face.name, w, h, d)
               : faceTransform3D(face.name, w, h, d);

            const {
               style: fStyle,
               className: fCls,
               body,
            } = faceAppearance(face, globalDef);

            const idx = STAGGER_ORDER.indexOf(face.name);
            const delay = oneAtATime
               ? (idx >= 0 ? idx : i) * transitionDuration
               : 0;

            return (
               <div
                  key={face.name + "-" + i}
                  className={fCls}
                  style={{
                     ...fStyle,
                     width: dims.width,
                     height: dims.height,
                     transform,
                     transition: transitionCss(delay),
                  }}
               >
                  {body}
               </div>
            );
         });

      /* ============================================================ */
      /*  Joined rendering — nested hinge structure                    */
      /*                                                               */
      /*  Chain: front → right → back  (hinged at shared edges)        */
      /*  Left is independent (the break‑point).                       */
      /*                                                               */
      /*  Flat order: front | right | back | left (left on far right)  */
      /* ============================================================ */

      const renderJoined = () => {
         const findFace = (n: string) =>
            faceList.find((f) => f.name === n);

         const frontFace = findFace("front");
         const rightFace = findFace("right");
         const backFace = findFace("back");
         const leftFace = findFace("left");

         const sideNames = new Set([
            "front",
            "right",
            "back",
            "left",
         ]);
         const otherFaces = faceList.filter(
            (f) => !sideNames.has(f.name)
         );

         const step = oneAtATime ? transitionDuration : 0;

         /* Helper: render a single face element with merged styles */
         const renderFaceEl = (
            face: FaceDef | undefined,
            dims: { width: number; height: number },
            extra: React.CSSProperties,
            key: string
         ) => {
            if (!face) return null;
            const {
               style: fStyle,
               className: fCls,
               body,
            } = faceAppearance(face, globalDef);
            return (
               <div
                  key={key}
                  className={fCls}
                  style={{
                     ...fStyle,
                     width: dims.width,
                     height: dims.height,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     boxSizing: "border-box",
                     ...extra,
                  }}
               >
                  {body}
               </div>
            );
         };

         return (
            <>
               {/* ---- Front face (anchor) ---- */}
               {renderFaceEl(
                  frontFace,
                  { width: w, height: h },
                  {
                     position: "absolute",
                     left: "50%",
                     top: "50%",
                     transform: flat
                        ? "translate(-50%, -50%)"
                        : `translate(-50%, -50%) translateZ(${d / 2}px)`,
                     transition: transitionCss(0),
                  },
                  "front-j"
               )}

               {/* ---- Right hinge (pivots at front's right edge) ---- */}
               <div
                  style={{
                     position: "absolute",
                     left: `calc(50% + ${w / 2}px)`,
                     top: "50%",
                     width: 0,
                     height: 0,
                     transformOrigin: "0 0",
                     transformStyle: "preserve-3d",
                     transform: flat
                        ? "none"
                        : `translateZ(${d / 2}px) rotateY(90deg)`,
                     transition: transitionCss(step),
                  }}
               >
                  {/* Right face */}
                  {renderFaceEl(
                     rightFace,
                     { width: d, height: h },
                     {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        transform: "translateY(-50%)",
                     },
                     "right-j"
                  )}

                  {/* ---- Back hinge (pivots at right's far edge) ---- */}
                  <div
                     style={{
                        position: "absolute",
                        left: d,
                        top: 0,
                        width: 0,
                        height: 0,
                        transformOrigin: "0 0",
                        transformStyle: "preserve-3d",
                        transform: flat
                           ? "none"
                           : "rotateY(90deg)",
                        transition: transitionCss(step * 2),
                     }}
                  >
                     {/* Back face */}
                     {renderFaceEl(
                        backFace,
                        { width: w, height: h },
                        {
                           position: "absolute",
                           left: 0,
                           top: 0,
                           transform: "translateY(-50%)",
                        },
                        "back-j"
                     )}

                     {/* ---- Left hinge (pivots at back's far edge) ---- */}
                     <div
                        style={{
                           position: "absolute",
                           left: w,
                           top: 0,
                           width: 0,
                           height: 0,
                           transformOrigin: "0 0",
                           transformStyle: "preserve-3d",
                           transform: flat
                              ? "none"
                              : "rotateY(90deg)",
                           transition: transitionCss(step * 3),
                        }}
                     >
                        {/* Left face */}
                        {renderFaceEl(
                           leftFace,
                           { width: d, height: h },
                           {
                              position: "absolute",
                              left: 0,
                              top: 0,
                              transform: "translateY(-50%)",
                           },
                           "left-j"
                        )}
                     </div>
                  </div>
               </div>

               {/* ---- Non-side faces (top, bottom, etc.) ---- */}
               {otherFaces.map((face, i) => {
                  const dims = faceDimensions(face.name, w, h, d);
                  const xform = flat
                     ? faceTransformFlat(face.name, w, h, d)
                     : faceTransform3D(face.name, w, h, d);
                  const {
                     style: fStyle,
                     className: fCls,
                     body,
                  } = faceAppearance(face, globalDef);
                  return (
                     <div
                        key={face.name + "-o-" + i}
                        className={fCls}
                        style={{
                           ...fStyle,
                           width: dims.width,
                           height: dims.height,
                           transform: xform,
                           transition: transitionCss(0),
                        }}
                     >
                        {body}
                     </div>
                  );
               })}
            </>
         );
      };

      /* ============================================================ */
      /*  Render tree                                                  */
      /* ============================================================ */

      const cssVars = {
         "--obj-w": w + "px",
         "--obj-h": h + "px",
         "--obj-d": d + "px",
      } as React.CSSProperties;

      return (
         <div
            className={["anim3d-stage", className]
               .filter(Boolean)
               .join(" ")}
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
                  animation: flat ? "none" : animation1,
                  transformStyle: "preserve-3d",
                  transition: transitionCss(),
               }}
            >
               {/* Inner animation wrapper (anim2) */}
               <div
                  className="anim3d-wrapper"
                  style={{
                     ...cssVars,
                     animation: flat ? "none" : animation2,
                     transformStyle: "preserve-3d",
                     transition: transitionCss(),
                  }}
               >
                  {showCenterDiv && (
                     <div className="anim3d-center" />
                  )}
                  {remainJoined
                     ? renderJoined()
                     : renderStandard()}
               </div>
            </div>
         </div>
      );
   }
);

Obj.displayName = "Obj";
