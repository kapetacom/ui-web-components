import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import css from 'rollup-plugin-styler';
import { dts } from 'rollup-plugin-dts';
import sizes from 'rollup-plugin-sizes';
import { visualizer } from 'rollup-plugin-visualizer';
import json from '@rollup/plugin-json';
import packageJson from './package.json' with { type: 'json' };

const plugins = (/** @type {string} */ dir) => [
  external(),
  json(),
  resolve(),
  commonjs(),
  typescript({
      tsconfig: './tsconfig.build.json',
      outDir: dir,
      declarationDir: dir,
  }),
  css(),
  visualizer(),
  sizes(),
];


export default [
    {
        input: 'src/index.ts',
        external: ['monaco-editor'],
        output: [
            {
                dir: 'dist/cjs',
                preserveModules: true,
                preserveModulesRoot: './src',
                format: 'cjs',
                name: packageJson.name,
                generatedCode: 'es2015',
                compact: false,
                sourcemap: false,
            },
        ],
        plugins: plugins('dist/cjs')
    },
    {
      input: 'src/index.ts',
      external: ['monaco-editor'],
      output: [
          {
              dir: 'dist/esm',
              preserveModules: true,
              preserveModulesRoot: './src',
              format: 'esm',
              name: packageJson.name,
              generatedCode: 'es2015',
              compact: false,
              sourcemap: false,
          },
      ],
      plugins: plugins('dist/esm'),
  },
    {
        input: 'dist/esm/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        external: [/\.(css|less)$/],
        plugins: [dts()],
    },
];
