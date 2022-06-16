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
import entries from './entries'

const vendorId    = packageConfig.pwajet.company
const extensionId = packageConfig.name

const isProduction = process.env.NODE_ENV === 'production'
const BUILD_DESTINATION = isProduction ? 'build' : 'public'
const CORE_EXTENSIONS_PATH = `assets/extensions/${vendorId}/${extensionId}`
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
    fileName: `esm-extensions.js`,
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
        src: `${BUILD_PATH}/esm-extensions.js`,
        dest: `${ENTRY_PATH}/`
      },
    ],
    hook: 'closeBundle'
  }),
  externalGlobals((id) => {
    if (id === 'react') {
      return 'window.React'
    }
    if (id === 'react-dom') {
      return 'window.ReactDOM'
    }
    if (id === 'redux') {
      return 'window.redux'
    }
    if (id === 'react-redux') {
      return 'window.reactRedux'
    }
    if (id === 'pwajet') {
      return 'window.pwajet'
    }
    if (id === 'pwajet_mf') {
      return 'window.pwajet_mf'
    }
    if (id === 'react-intl') {
      return 'window.intl'
    }
    if (id === 'react-router') {
      return 'window.reactRouter'
    }
    if (id === 'react-router-dom') {
      return 'window.reactRouterDom'
    }
    if (id === 'rxjs') {
      return 'window.rxjs'
    }
    if (id === 'redux-observable') {
      return 'window.reduxObservable'
    }

    if (/@pwajet\//.test(id)) {
      return `window.pwajet_mf.get('${id.replace('@pwajet', '.')}')`
    }

    if (id.startsWith('pwajet-')) {
      return `window.pwajet.core.extensionApiService.getApi('${id}')`
    }
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
  isProduction && terser({
    // Keep react components names
    keep_fnames: /[A-Z]\w+/
  }),
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
    input: entries({ options: {vendorId, extensionId} }).map(entry => ({
      [entry.name]: entry.file,
    })),
    output: {
      dir: BUILD_PATH,
      entryFileNames: `${packageConfig.version}.[hash].[name].js`,
      format: 'esm',
      chunkFileNames: 'chunks/[name]-[hash].js'
    },
    plugins,
  }
}

function composeExtensionsFilesTemplate() {
  const content = fs.readFileSync(`${ENTRY_PATH}/esm-extensions.js`, {encoding: 'utf-8'})
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
      `# PWAjet extension: ${vendorId}: ${extensionId} \n\n` +
      `## Insert this lines at \`esm-extensions.js\`\n\n` +
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
