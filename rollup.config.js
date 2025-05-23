import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import pkg from "./package.json" with { type: "json" };


/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "src/index.ts",
  // preserveModules: true,
  plugins: [
    typescript({
      noEmitOnError: true,
      tsconfig: "./tsconfig.build.json",
    }),
    nodeResolve(),
    commonjs(),
    postcss({
      plugins: [autoprefixer()],
      sourceMap: true,
      extract: "styles.css",
      minimize: true,
      modules: true,
    }),
  ],
  external: [
    "react/jsx-runtime",
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {}),
  ],
  output: [
    {
      file: "lib/index.cjs",
      format: "cjs",
    },
    {
      file: "lib/index.esm.js",
      format: "es",
    },
  ],
};
