import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
   plugins: [react()],
   root: "examples",
   server: {
      port: 3000,
   },
   appType: "spa",  // serves index.html for all routes (SPA fallback)
   resolve: {
      alias: {
         // Import from live source, not dist
         "anim-3d-obj": path.resolve(__dirname, "src/index.ts"),
         "@": path.resolve(__dirname, "examples"),
      },
   },
});
