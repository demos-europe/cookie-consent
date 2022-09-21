import {terser} from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'

export default {
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: pkg.browser,
      format: 'iife',
      name: 'DpConsent'
    }
  ],
  plugins: [
    postcss({}),
    terser()
  ]
}
