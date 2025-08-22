import React, { CSSProperties, ReactNode } from 'react';

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
    className?: string;
    style?: CSSProperties;
};

declare const Obj: React.FC<ObjProps>;

export { type AnimationConfig as A, type BuiltInAnimName as B, type FaceDef as F, type GlobalDef as G, type ObjProps as O, Obj, type FaceName as a, Obj as default };
