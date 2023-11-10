import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import styles from 'rollup-plugin-styles';
import dts from 'rollup-plugin-dts';

const { visualizer } = require('rollup-plugin-visualizer');
const bundleSize = require('rollup-plugin-bundle-size');

const packageJson = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                name: packageJson.name,
                generatedCode: 'es2015',
                compact: false,
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: 'esm',
                name: packageJson.name,
                generatedCode: 'es2015',
                compact: false,
                sourcemap: true,
            },
        ],
        plugins: [
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
        input: 'dist/cjs/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        external: [/\.(css|less)$/],
        plugins: [dts()],
    },
];
