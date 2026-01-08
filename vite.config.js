import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isDemo = mode === "demo";

  return {
    base: isDemo ? "./" : "/",
    build: isDemo
      ? {
    outDir: "dist",
          emptyOutDir: true,
        }
      : {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "SolarMobileUI",
            fileName: (format) =>
              format === "es"
                ? "solarmobile-ui.es.js"
                : `solarmobile-ui.${format}.js`,
            formats: ["es", "cjs"],
          },
          rollupOptions: {
            // Externalize peer deps for library consumers
            external: [
              "lit",
              "chart.js",
              "three",
              /^@shoelace-style\/shoelace/,
            ],
            output: {
              globals: {
                lit: "Lit",
                "chart.js": "Chart",
                three: "THREE",
              },
            },
          },
          sourcemap: true,
          emptyOutDir: true,
  },
  };
});
