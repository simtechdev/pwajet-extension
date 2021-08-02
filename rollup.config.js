const path = require('path')
import fs from 'fs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import del from 'rollup-plugin-delete'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import html from '@rollup/plugin-html'
import copy from 'rollup-plugin-copy'
import externalGlobals from 'rollup-plugin-external-globals'
import multiInput from 'rollup-plugin-multi-input'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import packageConfig from './package.json'

// Replace with your company name
const VENDOR_ID = 'noname'
// Replace with your addon name
const EXTENSION_ID = 'example-addon'

const isProduction = process.env.NODE_ENV === 'production'
const BUILD_DESTINATION = isProduction ? 'build' : 'public'
const CORE_EXTENSIONS_PATH = `assets/extensions/${VENDOR_ID}/${EXTENSION_ID}`
const BUILD_PATH = `./${BUILD_DESTINATION}/${CORE_EXTENSIONS_PATH}`
const ENTRY_PATH = `./${BUILD_DESTINATION}/assets/extensions`

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const plugins = [
  // Preferably set as first plugin.
  peerDepsExternal(),
  commonjs({ sourceMap: false }),
  del({
    targets: [
      BUILD_PATH
    ]
  }),
  resolve({
    dedupe: ['react', 'react-dom'],
    extensions,
  }),
  postcss({
    config: {
      path: 'postcss.config.js',
    }
  }),
  // https://github.com/rollup/rollup-plugin-babel/issues/255
  babel({
    babelHelpers: 'bundled',
    sourceMap: false,
    skipPreflightCheck: true,
    ignore: [
      /node_modules/
    ],
    configFile:  path.resolve(__dirname, '.babelrc'),
    extensions,
  }),
  !isProduction && html({
    hook: 'closeBundle',
    fileName: `extensions-files.js`,
    template: composeExtensionsFilesTemplate()
  }),
  isProduction && html({
    hook: 'closeBundle',
    fileName: `INSTRUCTION.md`,
    template: composeBuildInstructionTemplate()
  }),
  copy({
    targets: [
      {
        src: `${BUILD_PATH}/extensions-files.js`,
        dest: `${ENTRY_PATH}/`
      },
      {
        src: `${BUILD_PATH}/${VENDOR_ID}-${EXTENSION_ID}.d.ts`,
        dest: `${ENTRY_PATH}/`
      }
    ],
    hook: 'closeBundle'
  }),
  externalGlobals({
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
    'redux': 'window.redux',
    'react-redux': 'window.reactRedux',
    'pwajet': 'window.pwajet',
    'pwajet_mf': 'window.pwajet_mf',
    'react-intl': 'window.intl',
    'react-router': 'window.reactRouter',
    'react-router-dom': 'window.reactRouterDom',
    'rxjs': 'window.rxjs',
    'redux-observable': 'window.reduxObservable',

    // consume webpack module federation
    '@pwajet/entities/error/factories/apiErrorFactory':
      "window.pwajet_mf.get('./entities/error/factories/apiErrorFactory')",

    '@pwajet/api/parser/cscart/FormSchema':
      "window.pwajet_mf.get('./api/parser/cscart/FormSchema')",

    '@pwajet/entities/form/factories/formSchemaFactory':
      "window.pwajet_mf.get('./entities/form/factories/formSchemaFactory')",

    '@pwajet/utils/notifications/messages':
      "window.pwajet_mf.get('./utils/notifications/messages')",
  }, {
    dynamicWrapper: (id) => {

      if (/window.pwajet_mf/.test(id)) {
        return `Promise.resolve(${id}.then(module => module()))`
      }
      return `Promise.resolve(${id})`;
    }
  }),
  // https://github.com/rollup/rollup/issues/487
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development' )
  }),
  multiInput(),
  isProduction && terser(),
  !isProduction && serve({
    contentBase: 'public',
    historyApiFallback: true,
  }),
  !isProduction && livereload({
    watch: 'public',
  }),
];

export default () => {
  return {
    input: [
      /**
       * RenderSubscriber is a required postfix
       */
      {exampleAddonRenderSubscriber: `./src/index.tsx`},
      {exampleAddonNewRenderSubscriber: `./src/index-2.tsx`},
      {[`${VENDOR_ID}-${EXTENSION_ID}InternalApi`]: `./src/internals.ts`},
    ],
    output: {
      dir: BUILD_PATH,
      entryFileNames: `${packageConfig.version}.[hash].[name].js`,
      format: 'esm',
    },
    plugins,
  }
}

function composeExtensionsFilesTemplate() {
  const content = fs.readFileSync(`${ENTRY_PATH}/extensions-files.js`, {encoding: 'utf-8'})
  const startDelimiter = `/*insert-code-start*/`
  const endDelimiter = `/*insert-code-end*/`
  const startDelimiterRegExp = startDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const endDelimiterRegExp = endDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const extensionRelativeCodeRegExp = new RegExp(`(${startDelimiterRegExp}.*${endDelimiterRegExp})`, 'mgsiu')
  const contentWithoutExtensionRelativeCode = content.replace(extensionRelativeCodeRegExp, '')
  return ({ files, }) => {
    return `${contentWithoutExtensionRelativeCode}
${startDelimiter}
window.pwajet.esmExtensions.push(
${files.js.map(file => `  window.publicPath + '${CORE_EXTENSIONS_PATH}/${file.fileName}'`).join(',\n')}
);
${endDelimiter}`

  }
}

function composeBuildInstructionTemplate() {
  return ({ files, }) => {
    const assets = files.js.map(file => `window.publicPath + '${CORE_EXTENSIONS_PATH}/${file.fileName}'`)

    return (
      `# PWAjet extension: ${VENDOR_ID}: ${EXTENSION_ID} \n\n` +
      `## Insert this lines at \`extensions-files.js\`\n\n` +
      assets.map(asset => `* \`${asset}\``).join('\n') +
      '\n\n' +
      `Like the following:\n` +
      `\`\`\`JS
      window.pwajet.esmExtensions.push(
        window.publicPath + 'assets/extensions/core/ext/fd7cdacc.spaLogoBlock.js',
        window.publicPath + 'assets/extensions/core/ext/38db84e3.spaLogoBlockPropsFactory.js',
        // ...other assets
        // Your assets:\n${assets.map(asset => `${' '.repeat(8)}${asset}`).join(',\n')}
      );
\`\`\``
    )
  }
}
