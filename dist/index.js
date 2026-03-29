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
    className,
    style
  }) => {
    const w = typeof width === "number" ? width : parseFloat(String(width));
    const h = typeof height === "number" ? height : parseFloat(String(height));
    const d = typeof depth === "number" ? depth : parseFloat(String(depth));
    const animation1 = toAnimationShorthand(anim1) ?? void 0;
    const animation2 = toAnimationShorthand(anim2) ?? void 0;
    const faceList = faces && faces.length > 0 ? faces : DEFAULT_FACE_NAMES.map((name) => ({ name }));
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
      const transform = flat ? faceTransformFlat(face.name, w, h, d) : faceTransform3D(face.name, w, h, d);
      const {
        style: fStyle,
        className: fCls,
        body
      } = faceAppearance(face, globalDef);
      const idx = STAGGER_ORDER.indexOf(face.name);
      const delay = oneAtATime ? (idx >= 0 ? idx : i) * transitionDuration : 0;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: fCls,
          style: {
            ...fStyle,
            width: dims.width,
            height: dims.height,
            transform,
            transition: transitionCss(delay)
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
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: fCls,
            style: {
              ...fStyle,
              width: dims.width,
              height: dims.height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              ...extra
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
            transform: flat ? "translate(-50%, -50%)" : `translate(-50%, -50%) translateZ(${d / 2}px)`,
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
              transform: flat ? "none" : `translateZ(${d / 2}px) rotateY(90deg)`,
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
                    transform: flat ? "none" : "rotateY(90deg)",
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
                          transform: flat ? "none" : "rotateY(90deg)",
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
          const xform = flat ? faceTransformFlat(face.name, w, h, d) : faceTransform3D(face.name, w, h, d);
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
                transition: transitionCss(0)
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
                  animation: flat ? "none" : animation1,
                  transformStyle: "preserve-3d",
                  transition: transitionCss()
                },
                children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "anim3d-wrapper",
                    style: {
                      ...cssVars,
                      animation: flat ? "none" : animation2,
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