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
   className?: string;
   style?: CSSProperties;
};
