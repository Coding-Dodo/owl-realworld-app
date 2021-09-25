import serve from "rollup-plugin-serve";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import json from "@rollup/plugin-json";
import terser from "rollup-plugin-terser";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import copy from "rollup-plugin-copy";
import replace from "rollup-plugin-replace";
import babel from "rollup-plugin-babel";

const isProduction = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: "dist/bundle.js",
        format: "esm",
      },
    ],
    plugins: [
      replace({
        "process.env.OWL_ENV": isProduction ? '"production"' : '"dev"',
      }),
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json({
        compact: true,
      }),
      builtins(),
      globals(),
      copy({
        targets: [{ src: "public/index.html", dest: "dist" }],
      }),
      babel({
        exclude: "node_modules/**",
      }),
      !isProduction &&
        serve({
          open: false,
          verbose: true,
          contentBase: ["dist", "public"],
          host: "localhost",
          port: 8080,
          publicPath: "/",
        }),
      !isProduction && livereload(),
      isProduction && terser.terser(),
    ],
    watch: {
      exclude: ["node_modules/**"],
    },
  },
];
