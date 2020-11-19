import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";

export default {
  input: "index.js",
  output: {
    format: "iife",
    name: "app",
    file: "public/bundle.js",
  },
  plugins: [svelte(), resolve()],
};
