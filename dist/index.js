import * as React from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

// src/components/Obj.tsx

// src/keyframes.ts
function ensureStyleTag() {
  let tag = document.getElementById(
    "anim3d-keyframes"
  );
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "anim3d-keyframes";
    document.head.appendChild(tag);
  }
  return tag;
}
function inject(css) {
  if (typeof document === "undefined") return;
  const tag = ensureStyleTag();
  tag.appendChild(document.createTextNode(css));
}
function builtInKeyframes(name, cfg) {
  const hi = cfg.degreesHi ?? 15;
  const lo = cfg.degreesLow ?? -15;
  switch (name) {
    case "Y360":
      return `@keyframes Y360 { from { transform: rotateY(0deg) } to { transform: rotateY(360deg) } }`;
    case "X360":
      return `@keyframes X360 { from { transform: rotateX(0deg) } to { transform: rotateX(360deg) } }`;
    case "Z360":
      return `@keyframes Z360 { from { transform: rotateZ(0deg) } to { transform: rotateZ(360deg) } }`;
    case "rockY":
      return `@keyframes rockY { 0%{ transform: rotateY(${lo}deg) } 50%{ transform: rotateY(${hi}deg) } 100%{ transform: rotateY(${lo}deg) } }`;
    case "rockX":
      return `@keyframes rockX { 0%{ transform: rotateX(${lo}deg) } 50%{ transform: rotateX(${hi}deg) } 100%{ transform: rotateX(${lo}deg) } }`;
    default:
      return "";
  }
}
function resolveAnimation(cfg) {
  if (!cfg) return null;
  const name = cfg.name;
  const builtIn = builtInKeyframes(name, cfg);
  if (builtIn) {
    const marker = `/*kf-${name}*/`;
    if (typeof document !== "undefined") {
      const tag = ensureStyleTag();
      if (!tag.innerHTML.includes(marker)) {
        inject(`${builtIn}
${marker}`);
      }
    }
    return name;
  }
  return name;
}
function toAnimationShorthand(cfg) {
  const name = resolveAnimation(cfg);
  if (!cfg || !name) return null;
  const dur = (cfg.duration ?? 10) + "s";
  const delay = (cfg.delay ?? 0) + "s";
  const iter = cfg.iterationCount ?? "infinite";
  const dir = cfg.direction ?? "normal";
  const timing = cfg.timing ?? "linear";
  const fill = cfg.fillMode ?? "forwards";
  const play = cfg.animationPlayState ?? "running";
  return `${name} ${dur} ${timing} ${delay} ${iter} ${dir} ${fill} ${play}`;
}
function faceTransform3D(name, w, h, d) {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;
  switch (name) {
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
function faceTransformFlat(name, w, h, d) {
  const total = 2 * w + 2 * d;
  const half = total / 2;
  let cx;
  switch (name) {
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
function parseCssText(css) {
  if (!css) return {};
  const style = {};
  css.split(";").forEach((rule) => {
    const [prop, ...rest] = rule.split(":");
    if (!prop || rest.length === 0) return;
    const key = prop.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    style[key] = rest.join(":").trim();
  });
  return style;
}
function faceDimensions(name, w, h, d) {
  switch (name) {
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
function faceAppearance(face, globalDef) {
  const globalStyle = parseCssText(globalDef?.css);
  const faceInlineStyle = parseCssText(face.css);
  const style = {
    ...globalStyle,
    ...globalDef?.style ?? {},
    ...faceInlineStyle,
    ...face.style ?? {}
  };
  const className = ["anim3d-face", face.className].filter(Boolean).join(" ");
  const body = face.body ?? globalDef?.body ?? null;
  return { style, className, body };
}
var DEFAULT_FACE_NAMES = [
  "front",
  "back",
  "left",
  "right",
  "top",
  "bottom"
];
var STAGGER_ORDER = [
  "front",
  "right",
  "back",
  "left",
  "top",
  "bottom",
  "top_front",
  "top_rear",
  "bottom_front",
  "bottom_rear"
];
var Obj = React.memo(
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
    style
  }) => {
    const w = typeof width === "number" ? width : parseFloat(String(width));
    const h = typeof height === "number" ? height : parseFloat(String(height));
    const d = typeof depth === "number" ? depth : parseFloat(String(depth));
    const animation1 = toAnimationShorthand(anim1) ?? void 0;
    const animation2 = toAnimationShorthand(anim2) ?? void 0;
    const [phase, setPhase] = React.useState(
      flat ? "chained" : "folded"
    );
    const hasChain = Array.isArray(chainEffects) && chainEffects.length > 0;
    const sideCountRef = React.useRef(0);
    const chainDur = React.useMemo(() => {
      if (!hasChain) return 0;
      return Math.max(
        0,
        ...chainEffects.map(
          (e) => (e.duration ?? 0.5) + (e.delay ?? 0)
        )
      );
    }, [chainEffects, hasChain]);
    const prevFlatForChain = React.useRef(flat);
    React.useEffect(() => {
      if (flat === prevFlatForChain.current) return;
      prevFlatForChain.current = flat;
      if (flat) {
        setPhase("unfolding");
      } else {
        if (hasChain && (phase === "chained" || phase === "chaining")) {
          setPhase("unchaining");
        } else {
          setPhase("folding");
        }
      }
    }, [flat]);
    React.useEffect(() => {
      let timer;
      if (phase === "unfolding") {
        const sideCount = sideCountRef.current;
        const unfoldDur = oneAtATime ? transitionDuration * sideCount : transitionDuration;
        timer = setTimeout(() => {
          if (hasChain) {
            setPhase("chaining");
          } else {
            setPhase("chained");
            onChainComplete?.();
          }
        }, unfoldDur * 1e3 + 60);
      }
      if (phase === "chaining") {
        timer = setTimeout(() => {
          setPhase("chained");
          onChainComplete?.();
        }, chainDur * 1e3 + 60);
      }
      if (phase === "unchaining") {
        timer = setTimeout(() => {
          setPhase("folding");
        }, chainDur * 1e3 + 60);
      }
      if (phase === "folding") {
        const sideCount = sideCountRef.current;
        const foldDur = oneAtATime ? transitionDuration * sideCount : transitionDuration;
        timer = setTimeout(() => {
          setPhase("folded");
          onChainReverseComplete?.();
        }, foldDur * 1e3 + 60);
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
      onChainReverseComplete
    ]);
    const isFlatNow = phase === "unfolding" || phase === "chaining" || phase === "chained" || phase === "unchaining";
    const chainActive = phase === "chaining" || phase === "chained";
    const chainMap = React.useMemo(() => {
      const map = /* @__PURE__ */ new Map();
      if (chainEffects) {
        for (const e of chainEffects) {
          map.set(e.faceName, e);
        }
      }
      return map;
    }, [chainEffects]);
    const chainKeyframeCache = React.useRef(/* @__PURE__ */ new Map());
    function getChainKeyframes(faceName, eff, baseTransform, reverse) {
      const sx = eff.scaleX ?? 1;
      const sy = eff.scaleY ?? 1;
      const dir = reverse ? "rev" : "fwd";
      const cacheKey = `${faceName}-${sx}-${sy}-${dir}-${baseTransform}`;
      const cached = chainKeyframeCache.current.get(cacheKey);
      if (cached) return cached;
      const fromScale = reverse ? `scaleX(${sx}) scaleY(${sy})` : `scaleX(1) scaleY(1)`;
      const toScale = reverse ? `scaleX(1) scaleY(1)` : `scaleX(${sx}) scaleY(${sy})`;
      const name = `anim3d-chain-${faceName}-${dir}-${Date.now()}`;
      let styleEl = document.getElementById("anim3d-chain-keyframes");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "anim3d-chain-keyframes";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent += `
@keyframes ${name} {
  from { transform: ${baseTransform} ${fromScale}; }
  to   { transform: ${baseTransform} ${toScale}; }
}
`;
      chainKeyframeCache.current.set(cacheKey, name);
      return name;
    }
    function chainStyle(faceName, baseTransform) {
      const eff = chainMap.get(faceName);
      if (!eff) return {};
      const dur = eff.duration ?? 0.5;
      const delay = eff.delay ?? 0;
      const timing = eff.timing ?? "ease-in-out";
      const styles = {};
      const base = baseTransform ?? "";
      const hasScale = eff.scaleX !== void 0 || eff.scaleY !== void 0;
      if (hasScale) {
        if (chainActive) {
          const kfName = getChainKeyframes(faceName, eff, base, false);
          styles.animation = `${kfName} ${dur}s ${timing} ${delay}s forwards`;
        } else if (phase === "unchaining") {
          const kfName = getChainKeyframes(faceName, eff, base, true);
          styles.animation = `${kfName} ${dur}s ${timing} ${delay}s forwards`;
        }
      }
      if (eff.background !== void 0) {
        if (chainActive) {
          styles.background = eff.background;
        }
      }
      if (eff.opacity !== void 0) {
        if (chainActive) {
          styles.opacity = eff.opacity;
        }
      }
      return styles;
    }
    const faceList = faces && faces.length > 0 ? faces : DEFAULT_FACE_NAMES.map((name) => ({ name }));
    sideCountRef.current = faceList.filter(
      (f) => ["front", "right", "back", "left"].includes(f.name)
    ).length;
    const bfv = backfaceHidden ? "hidden" : "visible";
    const transitionCss = (delay = 0) => `transform ${transitionDuration}s ease-in-out ${delay}s`;
    const tiltCount = React.useRef(0);
    const prevFlat = React.useRef(flat);
    const [tiltAnim, setTiltAnim] = React.useState(void 0);
    React.useEffect(() => {
      if (flat !== prevFlat.current) {
        prevFlat.current = flat;
        if (ytilt) {
          tiltCount.current += 1;
          const sideCount = faceList.filter(
            (f) => ["front", "right", "back", "left"].includes(
              f.name
            )
          ).length;
          const totalDur = oneAtATime ? transitionDuration * sideCount : transitionDuration;
          const name = tiltCount.current % 2 === 0 ? "anim3d-ytilt-a" : "anim3d-ytilt-b";
          setTiltAnim(
            `${name} ${totalDur}s ease-in-out 1 forwards`
          );
          const timer = setTimeout(
            () => setTiltAnim(void 0),
            totalDur * 1e3 + 50
          );
          return () => clearTimeout(timer);
        }
      }
    }, [flat, ytilt, transitionDuration, oneAtATime, faceList]);
    const renderStandard = () => faceList.map((face, i) => {
      const dims = faceDimensions(face.name, w, h, d);
      const baseTransform = isFlatNow ? faceTransformFlat(face.name, w, h, d) : faceTransform3D(face.name, w, h, d);
      const {
        style: fStyle,
        className: fCls,
        body
      } = faceAppearance(face, globalDef);
      const idx = STAGGER_ORDER.indexOf(face.name);
      const delay = oneAtATime ? (idx >= 0 ? idx : i) * transitionDuration : 0;
      const cStyle = chainStyle(face.name, baseTransform);
      const foldTransition = transitionCss(delay);
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: fCls,
          style: {
            ...fStyle,
            ...cStyle,
            width: dims.width,
            height: dims.height,
            transform: baseTransform,
            transition: foldTransition,
            backfaceVisibility: bfv
          },
          children: body
        },
        face.name + "-" + i
      );
    });
    const renderJoined = () => {
      const findFace = (n) => faceList.find((f) => f.name === n);
      const frontFace = findFace("front");
      const rightFace = findFace("right");
      const backFace = findFace("back");
      const leftFace = findFace("left");
      const sideNames = /* @__PURE__ */ new Set([
        "front",
        "right",
        "back",
        "left"
      ]);
      const otherFaces = faceList.filter(
        (f) => !sideNames.has(f.name)
      );
      const step = oneAtATime ? transitionDuration : 0;
      const renderFaceEl = (face, dims, extra, key) => {
        if (!face) return null;
        const {
          style: fStyle,
          className: fCls,
          body
        } = faceAppearance(face, globalDef);
        const baseTransform = extra.transform ?? "";
        const cStyle = chainStyle(face.name, baseTransform);
        const eff = chainMap.get(face.name);
        const hasChainAnim = !!cStyle.animation;
        let chainOrigin;
        if (hasChainAnim && eff) {
          const xOrigin = remainJoined && isFlatNow ? "left" : "center";
          const yOrigin = eff.keepAligned ?? "center";
          chainOrigin = `${xOrigin} ${yOrigin}`;
        }
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: fCls,
            style: {
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
              ...chainOrigin ? { transformOrigin: chainOrigin } : {}
            },
            children: body
          },
          key
        );
      };
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        renderFaceEl(
          frontFace,
          { width: w, height: h },
          {
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: isFlatNow ? "translate(-50%, -50%)" : `translate(-50%, -50%) translateZ(${d / 2}px)`,
            transition: transitionCss(0)
          },
          "front-j"
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              position: "absolute",
              left: `calc(50% + ${w / 2}px)`,
              top: "50%",
              width: 0,
              height: 0,
              transformOrigin: "0 0",
              transformStyle: "preserve-3d",
              transform: isFlatNow ? "none" : `translateZ(${d / 2}px) rotateY(90deg)`,
              transition: transitionCss(step)
            },
            children: [
              renderFaceEl(
                rightFace,
                { width: d, height: h },
                {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: "translateY(-50%)"
                },
                "right-j"
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: d,
                    top: 0,
                    width: 0,
                    height: 0,
                    transformOrigin: "0 0",
                    transformStyle: "preserve-3d",
                    transform: isFlatNow ? "none" : "rotateY(90deg)",
                    transition: transitionCss(step * 2)
                  },
                  children: [
                    renderFaceEl(
                      backFace,
                      { width: w, height: h },
                      {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        transform: "translateY(-50%)"
                      },
                      "back-j"
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: w,
                          top: 0,
                          width: 0,
                          height: 0,
                          transformOrigin: "0 0",
                          transformStyle: "preserve-3d",
                          transform: isFlatNow ? "none" : "rotateY(90deg)",
                          transition: transitionCss(step * 3)
                        },
                        children: renderFaceEl(
                          leftFace,
                          { width: d, height: h },
                          {
                            position: "absolute",
                            left: 0,
                            top: 0,
                            transform: "translateY(-50%)"
                          },
                          "left-j"
                        )
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        otherFaces.map((face, i) => {
          const dims = faceDimensions(face.name, w, h, d);
          const xform = isFlatNow ? faceTransformFlat(face.name, w, h, d) : faceTransform3D(face.name, w, h, d);
          const {
            style: fStyle,
            className: fCls,
            body
          } = faceAppearance(face, globalDef);
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: fCls,
              style: {
                ...fStyle,
                width: dims.width,
                height: dims.height,
                transform: xform,
                transition: transitionCss(0),
                backfaceVisibility: bfv
              },
              children: body
            },
            face.name + "-o-" + i
          );
        })
      ] });
    };
    const cssVars = {
      "--obj-w": w + "px",
      "--obj-h": h + "px",
      "--obj-d": d + "px"
    };
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: ["anim3d-stage", className].filter(Boolean).join(" "),
        style: {
          perspective,
          perspectiveOrigin,
          ...cssVars,
          ...style
        },
        "data-anim-3d-obj": true,
        role: "img",
        "aria-label": "3D object",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              transformStyle: "preserve-3d",
              animation: tiltAnim
            },
            children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "anim3d-wrapper",
                style: {
                  ...cssVars,
                  animation: isFlatNow ? "none" : animation1,
                  transformStyle: "preserve-3d",
                  transition: transitionCss()
                },
                children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "anim3d-wrapper",
                    style: {
                      ...cssVars,
                      animation: isFlatNow ? "none" : animation2,
                      transformStyle: "preserve-3d",
                      transition: transitionCss()
                    },
                    children: [
                      showCenterDiv && /* @__PURE__ */ jsx("div", { className: "anim3d-center" }),
                      remainJoined ? renderJoined() : renderStandard()
                    ]
                  }
                )
              }
            )
          }
        )
      }
    );
  }
);
Obj.displayName = "Obj";

export { Obj, Obj as default, resolveAnimation, toAnimationShorthand };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map