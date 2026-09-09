import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/test-day-7/" : "/",
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    globals: true,
    include: ["tests/unit/**/*.spec.tsx"],
  },
});
