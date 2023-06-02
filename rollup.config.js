import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import styles from 'rollup-plugin-styles';
import dts from 'rollup-plugin-dts';
import pegjs from 'rollup-plugin-pegjs';
const { visualizer } = require('rollup-plugin-visualizer');
const bundleSize = require('rollup-plugin-bundle-size');

const packageJson = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        inlineDynamicImports: true,
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                name: packageJson.name,
                generatedCode: 'es2015',
                compact: false,
            },
            {
                file: packageJson.module,
                format: 'esm',
                generatedCode: 'es2015',
                compact: false,
            },
        ],
        plugins: [
            pegjs(),
            external(),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.build.json',
            }),
            styles(),
            visualizer(),
            bundleSize(),
        ],
    },
    {
        input: 'dist/esm/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        external: [/\.(css|less)$/],
        plugins: [dts()],
    },
];
