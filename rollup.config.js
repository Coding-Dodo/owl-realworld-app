import serve from "rollup-plugin-serve";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import terser from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";

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
        preventAssignment: true,
      }),
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
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
