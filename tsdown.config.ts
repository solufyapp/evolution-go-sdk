import type { UserConfig } from "tsdown";

export default {
  entry: ["./src/index.ts"],
  format: ["cjs", "esm"],
  outDir: "lib",
  minify: false,
  sourcemap: false,
  nodeProtocol: "strip",
} satisfies UserConfig;
