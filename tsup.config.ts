import { defineConfig } from "tsup";

export default defineConfig({
   entry: {
      "index": "src/index.ts",
      "components/Obj": "src/components/Obj.tsx",
   },
   format: ["esm", "cjs"],
   dts: true,
   sourcemap: true,
   splitting: false,
   clean: true,
   external: ["react", "react-dom", "csstype"],
   // keep css emitted
   loader: { ".css": "copy" },
});
