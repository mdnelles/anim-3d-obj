import type { AnimationConfig } from "./types";

let counter = 0;
const uid = () => (++counter).toString(36);

/** Create (or reuse) a <style> tag for dynamic keyframes */
function ensureStyleTag(): HTMLStyleElement {
   let tag = document.getElementById(
      "anim3d-keyframes"
   ) as HTMLStyleElement | null;
   if (!tag) {
      tag = document.createElement("style");
      tag.id = "anim3d-keyframes";
      document.head.appendChild(tag);
   }
   return tag;
}

function inject(css: string) {
   if (typeof document === "undefined") return; // SSR
   const tag = ensureStyleTag();
   tag.appendChild(document.createTextNode(css));
}

/** Keyframes text for built-ins */
function builtInKeyframes(name: string, cfg: AnimationConfig) {
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
         // Custom names: let authors supply their own @keyframes in global CSS with that name.
         return "";
   }
}

/** Returns a concrete animation-name and ensures keyframes exist (for built-ins) */
export function resolveAnimation(cfg?: AnimationConfig): string | null {
   if (!cfg) return null;
   const name = cfg.name;
   const builtIn = builtInKeyframes(name, cfg);
   if (builtIn) {
      // Ensure single injection per built-in name
      const marker = `/*kf-${name}*/`;
      if (typeof document !== "undefined") {
         const tag = ensureStyleTag();
         if (!tag.innerHTML.includes(marker)) {
            inject(`${builtIn}\n${marker}`);
         }
      }
      return name; // use built-in name as animation-name
   }
   // custom: use author-provided @keyframes by name
   return name;
}

/** Build the full CSS animation shorthand from a config and resolved name */
export function toAnimationShorthand(cfg?: AnimationConfig): string | null {
   const name = resolveAnimation(cfg);
   if (!cfg || !name) return null;
   const dur = (cfg.duration ?? 10) + "s";
   const delay = (cfg.delay ?? 0) + "s";
   const iter = cfg.iterationCount ?? "infinite";
   const dir = cfg.direction ?? "normal";
   const timing = cfg.timing ?? "linear";
   const fill = cfg.fillMode ?? "forwards";
   const play = cfg.animationPlayState ?? "running";
   // name duration timing delay iteration-count direction fill-mode play-state
   return `${name} ${dur} ${timing} ${delay} ${iter} ${dir} ${fill} ${play}`;
}
