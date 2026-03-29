import * as React from 'react';
import { CSSProperties, ReactNode } from 'react';

type AnimationDirection = "normal" | "reverse" | "alternate" | "alternate-reverse";
type AnimationFill = "none" | "forwards" | "backwards" | "both";
type AnimationPlayState = "running" | "paused";
type TimingFn = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | string;
type BuiltInAnimName = "Y360" | "X360" | "Z360" | "rockY" | "rockX";
type AnimationConfig = {
    name: BuiltInAnimName | string;
    degreesHi?: number;
    degreesLow?: number;
    duration?: number;
    delay?: number;
    iterationCount?: number | "infinite";
    direction?: AnimationDirection;
    timing?: TimingFn;
    fillMode?: AnimationFill;
    animationPlayState?: AnimationPlayState;
};
type FaceName = "front" | "back" | "left" | "right" | "top" | "bottom" | "top_rear" | "top_front" | "bottom_rear" | "bottom_front";
type FaceDef = {
    name: FaceName | string;
    css?: string;
    style?: CSSProperties;
    body?: ReactNode | string;
    className?: string;
};
type GlobalDef = {
    css?: string;
    style?: CSSProperties;
    body?: ReactNode | string;
};
type ObjProps = {
    width?: number;
    height?: number;
    depth?: number;
    perspective?: number;
    perspectiveOrigin?: string;
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
    className?: string;
    style?: CSSProperties;
};

declare const Obj: React.FC<ObjProps>;

/** Returns a concrete animation-name and ensures keyframes exist (for built-ins) */
declare function resolveAnimation(cfg?: AnimationConfig): string | null;
/** Build the full CSS animation shorthand from a config and resolved name */
declare function toAnimationShorthand(cfg?: AnimationConfig): string | null;

export { type AnimationConfig, type AnimationDirection, type AnimationFill, type AnimationPlayState, type BuiltInAnimName, type FaceDef, type FaceName, type GlobalDef, Obj, type ObjProps, type TimingFn, Obj as default, resolveAnimation, toAnimationShorthand };
