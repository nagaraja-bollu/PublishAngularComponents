import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript';
var sass = require('node-sass');
import { nameLibrary, PATH_SRC, PATH_DIST } from './config-library.js';
export default {
  input: PATH_SRC + nameLibrary + '.ts',
  name: nameLibrary,
  external: [
    '@angular/core',
    "@angular/platform-browser",
    "rxjs/Rx",
    "@angular/forms"
  ],
  sourcemap: true,
  output: {
    file: PATH_DIST + nameLibrary + ".umd.js",
    format: 'umd'
  },
  plugins: [
    angular(
      {
        preprocessors: {
          template: template => template,
          style: scss => {
            let css;
            if (scss) {
              css = sass.renderSync({ data: scss }).css.toString();
              //console.log(css);
            } else {
              css = '';
            }

            return css;
          }
        }
      }
    ),
    typescript({
      typescript: require('typescript')
    }),
    resolve({
      module: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  onwarn: warning => {
    const skipCodes = [
      'THIS_IS_UNDEFINED',
      'MISSING_GLOBAL_NAME'
    ];
    if (skipCodes.indexOf(warning.code) !== -1) return;
    console.error(warning);
  }
};
