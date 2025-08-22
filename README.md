# anim-3d-obj

A lightweight React component for rendering and animating 3D-like objects using only HTML & CSS.  
No WebGL or heavy 3D libraries required.

---

## Features

-  🎨 Pure CSS-based 3D object rendering
-  ⚡ Zero dependencies (other than React)
-  🛠 Fully customizable width, height, depth, and colors
-  🌀 Built-in animation support
-  🌍 SSR-safe (works with Next.js, Remix, etc.)

---

## Peer requirements

React 18+. Works in Vite, CRA, Next.js (SSR-safe), Remix, etc.

---

## Installation

```bash
npm install anim-3d-obj
# or
yarn add anim-3d-obj
# or
pnpm add anim-3d-obj

import React from "react";
import { Obj } from "anim-3d-obj";

function App() {
  const global = {
    css: "border: 1px solid #00f; color:#00f; backface-visibility: visible; text-align:center; line-height: 120px; font-size: 14px;",
    body: "height: 120px; width: 120px;",
  };

  return (
    <Obj
      depth="120px"
      height="120px"
      width="120px"
      perspective="800px"
      rotation="x 1s linear infinite"
      global={global}
    >
      Hello 3D
    </Obj>
  );
}

export default App;
```
