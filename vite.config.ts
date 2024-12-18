import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // otherwise the tsc d.ts files are deleted
    emptyOutDir: false,
    lib: {
      entry:"src/sound-bite.ts",
      formats: ["es"]
    },
    minify: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["lit", "@lit/task"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        // globals: {
        //   vue: "Vue",
        // },
      },
    },
  },
});
