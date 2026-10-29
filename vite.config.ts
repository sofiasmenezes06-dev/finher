import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  // The single-file artifact inlines one script, so it can't load route chunks on demand.
  build: mode === "artifact" ? { rolldownOptions: { output: { codeSplitting: false } } } : undefined,
}));
