import * as React from "react";
import type {
   ObjProps,
   FaceDef,
   FaceName,
   FaceChainEffect,
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

/**
 * Animation phase state machine:
 *
 *   folded ──(flat=true)──► unfolding ──(done)──► chaining ──(done)──► chained
 *     ▲                                                                   │
 *     └──(done)── folding ◄──(done)── unchaining ◄──(flat=false)──────────┘
 *
 * When there are no chainEffects the chaining/unchaining phases are
 * zero-duration and effectively skipped.
 */
type AnimPhase =
   | "folded"
   | "unfolding"
   | "chaining"
   | "chained"
   | "unchaining"
   | "folding";

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
      ytilt = false,
      backfaceHidden = false,
      chainEffects,
      onChainComplete,
      onChainReverseComplete,
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

      /* ============================================================ */
      /*  Chain-phase state machine                                    */
      /* ============================================================ */

      const [phase, setPhase] = React.useState<AnimPhase>(
         flat ? "chained" : "folded"
      );

      const hasChain =
         Array.isArray(chainEffects) && chainEffects.length > 0;

      // Compute total unfold duration (includes stagger)
      const sideCountRef = React.useRef(0);

      // Max chain-effect duration (effect duration + effect delay)
      const chainDur = React.useMemo(() => {
         if (!hasChain) return 0;
         return Math.max(
            0,
            ...chainEffects!.map(
               (e) => (e.duration ?? 0.5) + (e.delay ?? 0)
            )
         );
      }, [chainEffects, hasChain]);

      // React to `flat` prop changes
      const prevFlatForChain = React.useRef(flat);
      React.useEffect(() => {
         if (flat === prevFlatForChain.current) return;
         prevFlatForChain.current = flat;

         if (flat) {
            // Forward: start unfolding
            setPhase("unfolding");
         } else {
            // Reverse: if chained, undo chain effects first
            if (hasChain && (phase === "chained" || phase === "chaining")) {
               setPhase("unchaining");
            } else {
               setPhase("folding");
            }
         }
      }, [flat]); // intentionally minimal deps — phase is read, not a dep

      // Phase transition timers
      React.useEffect(() => {
         let timer: ReturnType<typeof setTimeout> | undefined;

         if (phase === "unfolding") {
            // Wait for unfold CSS transitions to finish, then chain
            const sideCount = sideCountRef.current;
            const unfoldDur = oneAtATime
               ? transitionDuration * sideCount
               : transitionDuration;
            timer = setTimeout(() => {
               if (hasChain) {
                  setPhase("chaining");
               } else {
                  setPhase("chained");
                  onChainComplete?.();
               }
            }, unfoldDur * 1000 + 60);
         }

         if (phase === "chaining") {
            timer = setTimeout(() => {
               setPhase("chained");
               onChainComplete?.();
            }, chainDur * 1000 + 60);
         }

         if (phase === "unchaining") {
            timer = setTimeout(() => {
               setPhase("folding");
            }, chainDur * 1000 + 60);
         }

         if (phase === "folding") {
            const sideCount = sideCountRef.current;
            const foldDur = oneAtATime
               ? transitionDuration * sideCount
               : transitionDuration;
            timer = setTimeout(() => {
               setPhase("folded");
               onChainReverseComplete?.();
            }, foldDur * 1000 + 60);
         }

         return () => {
            if (timer) clearTimeout(timer);
         };
      }, [
         phase,
         hasChain,
         chainDur,
         transitionDuration,
         oneAtATime,
         onChainComplete,
         onChainReverseComplete,
      ]);

      // Derived booleans for rendering
      const isFlatNow =
         phase === "unfolding" ||
         phase === "chaining" ||
         phase === "chained" ||
         phase === "unchaining";

      const chainActive = phase === "chaining" || phase === "chained";

      // Build a map of chain effects by face name for quick lookup
      const chainMap = React.useMemo(() => {
         const map = new Map<string, FaceChainEffect>();
         if (chainEffects) {
            for (const e of chainEffects) {
               map.set(e.faceName, e);
            }
         }
         return map;
      }, [chainEffects]);

      // Inject a CSS @keyframes rule for a chain effect and return its name.
      // The keyframe approach is used instead of CSS transitions because
      // transitions are unreliable in nested preserve-3d / hinge contexts —
      // React's render cycle can commit the transition and target value in
      // the same paint frame, causing the browser to skip the animation.
      const chainKeyframeCache = React.useRef(new Map<string, string>());

      function getChainKeyframes(
         faceName: string,
         eff: FaceChainEffect,
         baseTransform: string,
         reverse: boolean
      ): string {
         const sx = eff.scaleX ?? 1;
         const sy = eff.scaleY ?? 1;
         const dir = reverse ? "rev" : "fwd";
         const cacheKey = `${faceName}-${sx}-${sy}-${dir}-${baseTransform}`;
         const cached = chainKeyframeCache.current.get(cacheKey);
         if (cached) return cached;

         const fromScale = reverse
            ? `scaleX(${sx}) scaleY(${sy})`
            : `scaleX(1) scaleY(1)`;
         const toScale = reverse
            ? `scaleX(1) scaleY(1)`
            : `scaleX(${sx}) scaleY(${sy})`;
         const name = `anim3d-chain-${faceName}-${dir}-${Date.now()}`;

         let styleEl = document.getElementById("anim3d-chain-keyframes");
         if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "anim3d-chain-keyframes";
            document.head.appendChild(styleEl);
         }
         styleEl.textContent += `\n@keyframes ${name} {
  from { transform: ${baseTransform} ${fromScale}; }
  to   { transform: ${baseTransform} ${toScale}; }
}\n`;
         chainKeyframeCache.current.set(cacheKey, name);
         return name;
      }

      /** Merge chain-effect styles onto a face when chain is active.
       *  Uses CSS @keyframes animations for reliable timing. */
      function chainStyle(
         faceName: string,
         baseTransform?: string
      ): React.CSSProperties {
         const eff = chainMap.get(faceName);
         if (!eff) return {};

         const dur = eff.duration ?? 0.5;
         const delay = eff.delay ?? 0;
         const timing = eff.timing ?? "ease-in-out";
         const styles: React.CSSProperties = {};
         const base = baseTransform ?? "";

         const hasScale =
            eff.scaleX !== undefined || eff.scaleY !== undefined;

         if (hasScale) {
            if (chainActive) {
               // Forward: animate from identity to target scale
               const kfName = getChainKeyframes(faceName, eff, base, false);
               styles.animation = `${kfName} ${dur}s ${timing} ${delay}s forwards`;
            } else if (phase === "unchaining") {
               // Reverse: animate from target scale back to identity
               const kfName = getChainKeyframes(faceName, eff, base, true);
               styles.animation = `${kfName} ${dur}s ${timing} ${delay}s forwards`;
            }
         }

         if (eff.background !== undefined) {
            if (chainActive) {
               styles.background = eff.background;
            }
         }

         if (eff.opacity !== undefined) {
            if (chainActive) {
               styles.opacity = eff.opacity;
            }
         }

         return styles;
      }

      // Determine which faces to render
      const faceList: FaceDef[] =
         faces && faces.length > 0
            ? faces
            : DEFAULT_FACE_NAMES.map((name) => ({ name }));

      // Keep sideCountRef up to date for phase timer calculations
      sideCountRef.current = faceList.filter((f) =>
         ["front", "right", "back", "left"].includes(f.name)
      ).length;

      const bfv: React.CSSProperties["backfaceVisibility"] =
         backfaceHidden ? "hidden" : "visible";

      const transitionCss = (delay = 0) =>
         `transform ${transitionDuration}s ease-in-out ${delay}s`;

      /* ============================================================ */
      /*  Y-tilt — fire a one-shot rotateX(0→45→0) each time          */
      /*  flat changes. We alternate between two identical keyframe    */
      /*  names (a/b) so the browser re-triggers the animation.        */
      /* ============================================================ */

      const tiltCount = React.useRef(0);
      const prevFlat = React.useRef(flat);
      const [tiltAnim, setTiltAnim] = React.useState<
         string | undefined
      >(undefined);

      React.useEffect(() => {
         if (flat !== prevFlat.current) {
            prevFlat.current = flat;
            if (ytilt) {
               tiltCount.current += 1;
               const sideCount = faceList.filter((f) =>
                  ["front", "right", "back", "left"].includes(
                     f.name
                  )
               ).length;
               const totalDur = oneAtATime
                  ? transitionDuration * sideCount
                  : transitionDuration;
               const name =
                  tiltCount.current % 2 === 0
                     ? "anim3d-ytilt-a"
                     : "anim3d-ytilt-b";
               setTiltAnim(
                  `${name} ${totalDur}s ease-in-out 1 forwards`
               );
               // Clear animation after it completes so it can re-trigger
               const timer = setTimeout(
                  () => setTiltAnim(undefined),
                  totalDur * 1000 + 50
               );
               return () => clearTimeout(timer);
            }
         }
      }, [flat, ytilt, transitionDuration, oneAtATime, faceList]);

      /* ============================================================ */
      /*  Standard rendering (no remainJoined)                         */
      /* ============================================================ */

      const renderStandard = () =>
         faceList.map((face, i) => {
            const dims = faceDimensions(face.name, w, h, d);
            const baseTransform = isFlatNow
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

            // Merge chain-effect styles (keyframe animation)
            const cStyle = chainStyle(face.name, baseTransform);
            const foldTransition = transitionCss(delay);

            return (
               <div
                  key={face.name + "-" + i}
                  className={fCls}
                  style={{
                     ...fStyle,
                     ...cStyle,
                     width: dims.width,
                     height: dims.height,
                     transform: baseTransform,
                     transition: foldTransition,
                     backfaceVisibility: bfv,
                  }}
               >
                  {body}
               </div>
            );
         });

      /* ============================================================ */
      /*  Joined rendering — nested hinge structure                    */
      /*                                                               */
      /*  Chain: front → right → back → left (hinged at shared edges)  */
      /*  The left–front edge is the break‑point.                      */
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

            // Chain effect styles (uses CSS keyframe animation)
            const baseTransform = (extra.transform as string) ?? "";
            const cStyle = chainStyle(face.name, baseTransform);

            // Chain animation uses transform-origin to control alignment
            const eff = chainMap.get(face.name);
            const hasChainAnim = !!cStyle.animation;
            let chainOrigin: string | undefined;
            if (hasChainAnim && eff) {
               const xOrigin = remainJoined && isFlatNow ? "left" : "center";
               const yOrigin = eff.keepAligned ?? "center";
               chainOrigin = `${xOrigin} ${yOrigin}`;
            }

            return (
               <div
                  key={key}
                  className={fCls}
                  style={{
                     ...fStyle,
                     ...cStyle,
                     width: dims.width,
                     height: dims.height,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     boxSizing: "border-box",
                     backfaceVisibility: bfv,
                     ...extra,
                     ...(chainOrigin ? { transformOrigin: chainOrigin } : {}),
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
                     transform: isFlatNow
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
                     transform: isFlatNow
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
                        transform: isFlatNow
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
                           transform: isFlatNow
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
                  const xform = isFlatNow
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
                           backfaceVisibility: bfv,
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
            {/* Y-tilt wrapper — sits between stage and anim wrappers */}
            <div
               style={{
                  transformStyle: "preserve-3d",
                  animation: tiltAnim,
               }}
            >
               {/* Outer animation wrapper (anim1) */}
               <div
                  className="anim3d-wrapper"
                  style={{
                     ...cssVars,
                     animation: isFlatNow ? "none" : animation1,
                     transformStyle: "preserve-3d",
                     transition: transitionCss(),
                  }}
               >
                  {/* Inner animation wrapper (anim2) */}
                  <div
                     className="anim3d-wrapper"
                     style={{
                        ...cssVars,
                        animation: isFlatNow ? "none" : animation2,
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
         </div>
      );
   }
);

Obj.displayName = "Obj";
