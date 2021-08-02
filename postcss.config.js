const { postcssRTLCSS } = require('postcss-rtlcss')
const cssnano = require('cssnano')
const postcssNested = require('postcss-nested')

module.exports = (ctx) => {
  const isProduction = ctx.env === 'production'
  return {
    plugins: [
      require('autoprefixer'),
      postcssNested(),
      postcssRTLCSS({ mode: 'override'}),
      isProduction && cssnano(({
        preset: 'default',
      })),
    ]
  }
}
