import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'index.js',
  output: {
    file: 'sortabletable/static/sortabletable/js/main.js',
    format: 'iife',
    minifyInternalExports: true
  },
  plugins: [nodeResolve(), commonjs(), terser()]
};
