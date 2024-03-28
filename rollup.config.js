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
    postcss({
      plugins: [autoprefixer()],
      sourceMap: true,
      extract: "styles.css",
      minimize: true,
      modules: true,
    }),
    // terser(), // minifies generated bundles
  ],
  external: [
    "react/jsx-runtime",
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {}),
  ],
  output: [
    {
      file: "lib/index.cjs.js",
      format: "cjs",
    },
    {
      file: "lib/index.esm.js",
      format: "es",
    },
  ],
};
