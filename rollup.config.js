import { createRollupConfig } from "svelte-lib/rollup.config.js"

export default createRollupConfig({
  scopeClass: "fireworks",
  entries: [
    {
      input: "./src/main.js",
      output: {
        format: "iife",
        file: "dist/bundle.js",
      },
    },
    {
      input: "./src/main2.js",
      output: {
        format: "es",
        file: "dist/bundle2.js",
      },
    },
  ],
})
