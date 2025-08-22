// src/components/Obj.tsx
import { useMemo } from "react";

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

// src/components/Obj.tsx
import "./obj-PY72GEW6.css";
import { jsx, jsxs } from "react/jsx-runtime";
function faceTransform(name, w, h, d) {
  const z = d / 2;
  switch (name) {
    case "front":
      return `translate3d(-50%, -50%, ${z}px)`;
    case "back":
      return `translate3d(-50%, -50%, ${-z}px) rotateY(180deg)`;
    case "left":
      return `translate3d(-50%, -50%, 0) rotateY(-90deg) translateZ(${w / 2}px)`;
    case "right":
      return `translate3d(-50%, -50%, 0) rotateY(90deg) translateZ(${w / 2}px)`;
    case "top":
      return `translate3d(-50%, -50%, 0) rotateX(90deg) translateZ(${h / 2}px)`;
    case "bottom":
      return `translate3d(-50%, -50%, 0) rotateX(-90deg) translateZ(${h / 2}px)`;
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
function mergeStyles(inlineCSS, style) {
  const out = { ...style ?? {} };
  if (inlineCSS) {
    inlineCSS.split(";").map((s) => s.trim()).filter(Boolean).forEach((rule) => {
      const [k, v] = rule.split(":");
      if (!k || !v) return;
      const key = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[key] = v.trim();
    });
  }
  return out;
}
function Face({
  w,
  h,
  d,
  face,
  global
}) {
  const base = useMemo(
    () => mergeStyles(global?.css, global?.style),
    [global]
  );
  const merged = useMemo(
    () => ({ ...base, ...mergeStyles(face.css, face.style) }),
    [base, face.css, face.style]
  );
  const content = face.body ?? global?.body ?? null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `anim3d-face ${face.className ?? ""}`,
      style: {
        transform: faceTransform(face.name, w, h, d),
        ...merged
      },
      "data-face": face.name,
      children: typeof content === "string" ? /* @__PURE__ */ jsx("span", { children: content }) : content
    }
  );
}
var Obj = ({
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
    { name: "bottom", body: "BOTTOM" }
  ],
  global,
  anim1,
  anim2,
  showCenterDiv = false,
  className,
  style
}) => {
  const resolvedAnim1 = toAnimationShorthand(anim1);
  const resolvedAnim2 = toAnimationShorthand(anim2);
  const animation = [resolvedAnim1, resolvedAnim2].filter(Boolean).join(", ");
  const stageStyle = {
    perspective: `${perspective}px`,
    perspectiveOrigin
  };
  const wrapperStyle = {
    // consumed by CSS var
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "--obj-w": `${width}px`,
    "--obj-h": `${height}px`,
    width,
    height,
    "animation": animation || void 0
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `anim3d-stage ${className ?? ""}`,
      style: { ...stageStyle, ...style },
      children: /* @__PURE__ */ jsxs("div", { className: "anim3d-wrapper", style: wrapperStyle, children: [
        showCenterDiv && /* @__PURE__ */ jsx("div", { className: "anim3d-center" }),
        faces.map((f, i) => /* @__PURE__ */ jsx(
          Face,
          {
            w: width,
            h: height,
            d: depth,
            face: f,
            global
          },
          `${f.name}-${i}`
        ))
      ] })
    }
  );
};
var Obj_default = Obj;
export {
  Obj_default as Obj
};
//# sourceMappingURL=index.mjs.map