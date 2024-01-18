import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import css from 'rollup-plugin-styler';
import { dts } from 'rollup-plugin-dts';
import sizes from 'rollup-plugin-sizes';
import {visualizer} from "rollup-plugin-visualizer";
import bundleSize from "rollup-plugin-bundle-size";
import json from "@rollup/plugin-json";
import packageJson from "./package.json" assert { type: "json" };

export default [
    {
        input: 'src/index.ts',
        external: ['monaco-editor'],
        output: [
            {
                file: 'dist/cjs/index.js',
                format: 'cjs',
                name: packageJson.name,
                generatedCode: 'es2015',
                compact: false,
                sourcemap: false,
            },
            {
                file: 'dist/esm/index.js',
                format: 'esm',
                name: packageJson.name,
                generatedCode: 'es2015',
                compact: false,
                sourcemap: false,
            },
        ],
        plugins: [
            external(),
            json(),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.build.json',
            }),
            css(),
            visualizer(),
            bundleSize(),
            sizes(),
        ],
    },
    {
        input: 'dist/cjs/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        external: [/\.(css|less)$/],
        plugins: [dts()],
    },
];
