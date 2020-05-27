import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { eslint } from 'rollup-plugin-eslint';
import copy from 'rollup-plugin-copy'
import glslify from 'rollup-plugin-glslify';

const dev = process.env.ROLLUP_WATCH;
const mode = dev ? "development" : "production";

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    glslify(),
    eslint({
      fix: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(mode)
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      extensions: ['.js']
    }),
    !dev && terser({
      module: true
    }),
    copy({
      targets: [
        { src: 'static/**/*', dest: 'dist' },
      ]
    }),
    dev && livereload({ watch: 'dist' }),
    dev && serve({ contentBase: 'dist',  port: 8080, host: '0.0.0.0' })
  ]
};