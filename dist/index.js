import * as React from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

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
function faceTransform(name, w, h, d) {
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
var DEFAULT_FACE_NAMES = [
  "front",
  "back",
  "left",
  "right",
  "top",
  "bottom"
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
    className,
    style
  }) => {
    const w = typeof width === "number" ? width : parseFloat(width);
    const h = typeof height === "number" ? height : parseFloat(height);
    const d = typeof depth === "number" ? depth : parseFloat(depth);
    const animation1 = toAnimationShorthand(anim1) ?? void 0;
    const animation2 = toAnimationShorthand(anim2) ?? void 0;
    const faceList = faces && faces.length > 0 ? faces : DEFAULT_FACE_NAMES.map((name) => ({ name }));
    const renderFace = (face, i) => {
      const dims = faceDimensions(face.name, w, h, d);
      const transform = faceTransform(face.name, w, h, d);
      const globalStyle = parseCssText(globalDef?.css);
      const faceInlineStyle = parseCssText(face.css);
      const mergedStyle = {
        ...globalStyle,
        ...globalDef?.style ?? {},
        ...faceInlineStyle,
        ...face.style ?? {},
        width: dims.width,
        height: dims.height,
        transform
      };
      const body = face.body ?? globalDef?.body ?? null;
      const faceClassName = [
        "anim3d-face",
        face.className
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: faceClassName,
          style: mergedStyle,
          children: body
        },
        face.name + "-" + i
      );
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
            className: "anim3d-wrapper",
            style: {
              ...cssVars,
              animation: animation1,
              transformStyle: "preserve-3d"
            },
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "anim3d-wrapper",
                style: {
                  ...cssVars,
                  animation: animation2,
                  transformStyle: "preserve-3d"
                },
                children: [
                  showCenterDiv && /* @__PURE__ */ jsx("div", { className: "anim3d-center" }),
                  faceList.map(renderFace)
                ]
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