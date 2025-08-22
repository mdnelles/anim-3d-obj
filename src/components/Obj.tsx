import React, { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { FaceDef, GlobalDef, ObjProps, FaceName } from "../types";
import { toAnimationShorthand } from "../keyframes";
import "../styles/obj.css";

/** Map face name -> transform so it sits on a rectangular prism */
function faceTransform(name: string, w: number, h: number, d: number): string {
   const z = d / 2;
   switch (name as FaceName) {
      case "front":
         return `translate3d(-50%, -50%, ${z}px)`;
      case "back":
         return `translate3d(-50%, -50%, ${-z}px) rotateY(180deg)`;
      case "left":
         return `translate3d(-50%, -50%, 0) rotateY(-90deg) translateZ(${
            w / 2
         }px)`;
      case "right":
         return `translate3d(-50%, -50%, 0) rotateY(90deg) translateZ(${
            w / 2
         }px)`;
      case "top":
         return `translate3d(-50%, -50%, 0) rotateX(90deg) translateZ(${
            h / 2
         }px)`;
      case "bottom":
         return `translate3d(-50%, -50%, 0) rotateX(-90deg) translateZ(${
            h / 2
         }px)`;
      // legacy/extra – position near top/bottom, front/back edges
      case "top_front":
         return `translate3d(-50%, -50%, ${z / 2}px) rotateX(75deg)`;
      case "top_rear":
         return `translate3d(-50%, -50%, ${-z / 2}px) rotateX(105deg)`;
      case "bottom_front":
         return `translate3d(-50%, -50%, ${z / 2}px) rotateX(-75deg)`;
      case "bottom_rear":
         return `translate3d(-50%, -50%, ${-z / 2}px) rotateX(-105deg)`;
      default:
         return `translate3d(-50%, -50%, ${z}px)`;
   }
}

/** Merge legacy CSS string + style object */
function mergeStyles(inlineCSS?: string, style?: CSSProperties): CSSProperties {
   const out: CSSProperties = { ...(style ?? {}) };
   if (inlineCSS) {
      // naive parser: split by ;, then key:value
      inlineCSS
         .split(";")
         .map((s) => s.trim())
         .filter(Boolean)
         .forEach((rule) => {
            const [k, v] = rule.split(":");
            if (!k || !v) return;
            const key = k
               .trim()
               .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            (out as any)[key] = v.trim();
         });
   }
   return out;
}

function Face({
   w,
   h,
   d,
   face,
   global,
}: {
   w: number;
   h: number;
   d: number;
   face: FaceDef;
   global?: GlobalDef;
}) {
   const base = useMemo(
      () => mergeStyles(global?.css, global?.style),
      [global]
   );
   const merged = useMemo(
      () => ({ ...base, ...mergeStyles(face.css, face.style) }),
      [base, face.css, face.style]
   );

   const content: ReactNode = face.body ?? global?.body ?? null;

   return (
      <div
         className={`anim3d-face ${face.className ?? ""}`}
         style={{
            transform: faceTransform(face.name, w, h, d),
            ...merged,
         }}
         data-face={face.name}
      >
         {typeof content === "string" ? <span>{content}</span> : content}
      </div>
   );
}

const Obj: React.FC<ObjProps> = ({
   width = 160,
   height = 160,
   depth = 150,
   perspective = 500,
   perspectiveOrigin = "50% 50%",
   faces = [
      { name: "front", body: "FRONT" },
      { name: "back", body: "BACK" },
      { name: "left", body: "LEFT" },
      { name: "right", body: "RIGHT" },
      { name: "top", body: "TOP" },
      { name: "bottom", body: "BOTTOM" },
   ],
   global,
   anim1,
   anim2,
   showCenterDiv = false,
   className,
   style,
}) => {
   const resolvedAnim1 = toAnimationShorthand(anim1);
   const resolvedAnim2 = toAnimationShorthand(anim2);
   const animation = [resolvedAnim1, resolvedAnim2].filter(Boolean).join(", ");

   const stageStyle: CSSProperties = {
      perspective: `${perspective}px`,
      perspectiveOrigin,
   };

   const wrapperStyle: CSSProperties = {
      // consumed by CSS var
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      "--obj-w": `${width}px`,
      "--obj-h": `${height}px`,
      width,
      height,
      "animation": animation || undefined,
   };

   return (
      <div
         className={`anim3d-stage ${className ?? ""}`}
         style={{ ...stageStyle, ...style }}
      >
         <div className='anim3d-wrapper' style={wrapperStyle as any}>
            {showCenterDiv && <div className='anim3d-center' />}
            {faces.map((f, i) => (
               <Face
                  key={`${f.name}-${i}`}
                  w={width}
                  h={height}
                  d={depth}
                  face={f}
                  global={global}
               />
            ))}
         </div>
      </div>
   );
};

export default Obj;
export { Obj };
