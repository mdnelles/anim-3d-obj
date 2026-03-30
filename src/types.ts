import type { ReactNode, CSSProperties } from "react";

export type AnimationDirection =
   | "normal"
   | "reverse"
   | "alternate"
   | "alternate-reverse";

export type AnimationFill = "none" | "forwards" | "backwards" | "both";
export type AnimationPlayState = "running" | "paused";

export type TimingFn =
   | "linear"
   | "ease"
   | "ease-in"
   | "ease-out"
   | "ease-in-out"
   | string; // allow cubic-bezier(...)

export type BuiltInAnimName = "Y360" | "X360" | "Z360" | "rockY" | "rockX";

export type AnimationConfig = {
   name: BuiltInAnimName | string;
   degreesHi?: number; // used by "rock" variants
   degreesLow?: number;
   duration?: number; // seconds
   delay?: number; // seconds
   iterationCount?: number | "infinite";
   direction?: AnimationDirection;
   timing?: TimingFn;
   fillMode?: AnimationFill;
   animationPlayState?: AnimationPlayState;
};

export type FaceName =
   | "front"
   | "back"
   | "left"
   | "right"
   | "top"
   | "bottom"
   // legacy/extras – we’ll map these to reasonable transforms
   | "top_rear"
   | "top_front"
   | "bottom_rear"
   | "bottom_front";

export type FaceDef = {
   name: FaceName | string;
   css?: string; // inline CSS text (legacy support)
   style?: CSSProperties; // modern style object
   body?: ReactNode | string;
   className?: string;
};

export type GlobalDef = {
   css?: string; // legacy global CSS text for faces
   style?: CSSProperties; // modern style object
   body?: ReactNode | string;
};

/** Effect applied to a specific face after unfold completes (chained animation).
 *  On reverse, these effects are undone before the fold begins. */
export type FaceChainEffect = {
   faceName: string; // which face to target
   scaleX?: number; // scale factor (1 = no change)
   scaleY?: number;
   background?: string; // new background colour
   opacity?: number; // 0–1
   duration?: number; // seconds, default 0.5
   delay?: number; // seconds delay after chain phase starts
   timing?: TimingFn;
};

export type ObjProps = {
   width?: number; // px
   height?: number; // px
   depth?: number; // px

   perspective?: number; // px
   perspectiveOrigin?: string; // e.g., "50% 50%"

   faces?: FaceDef[];
   global?: GlobalDef;

   anim1?: AnimationConfig;
   anim2?: AnimationConfig;

   showCenterDiv?: boolean;

   /** When true, faces unfold from 3D cuboid into a flat side-by-side row */
   flat?: boolean;
   /** Seconds for the fold/unfold transition (default 1) */
   transitionDuration?: number;

   /** When true, faces unfold one at a time with staggered delays */
   oneAtATime?: boolean;
   /** When true, connected edges stay joined during unfold (front→right→back chain).
    *  The left–front edge is the break point. */
   remainJoined?: boolean;

   /** When true, the object tilts 45° on the X-axis (bird's-eye view) during
    *  a fold/unfold transition, then returns to 0° when the transition
    *  completes. Only active while flat is changing. */
   ytilt?: boolean;

   /** When true, faces are hidden when rotated away from the viewer
    *  (CSS backface-visibility: hidden). Default false. */
   backfaceHidden?: boolean;

   /** Effects applied to individual faces after the unfold completes.
    *  Reversed automatically before a fold begins. */
   chainEffects?: FaceChainEffect[];

   /** Called when the full forward chain (unfold + effects) completes */
   onChainComplete?: () => void;
   /** Called when the full reverse chain (un-effects + fold) completes */
   onChainReverseComplete?: () => void;

   className?: string;
   style?: CSSProperties;
};
