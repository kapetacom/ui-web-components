import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
import external from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"
import dts from "rollup-plugin-dts"
import pegjs from "rollup-plugin-pegjs";
import sourcemaps from 'rollup-plugin-sourcemaps';


const packageJson = require("./package.json")

export default [
    {
        input: "src/index.ts",
        inlineDynamicImports: true,
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: 'inline',
                name: packageJson.name,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: 'inline',
            }
        ],
        plugins: [
            //sourcemaps(),
            pegjs(),
            external(),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: "./tsconfig.build.json"
            }),
            postcss(),
            terser(),
        ],
    },
    {
        input: "dist/esm/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        external: [/\.(css|less)$/],
        plugins: [dts()],
    }
]