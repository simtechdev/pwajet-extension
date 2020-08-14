const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssRtl = require('./webpack/postcss-rtl');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./module.config');

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    ignoreOrder: true,
    filename: `assets/extensions/${config.vendor}/${config.name}/css/[name].[contenthash].css`,
    chunkFilename: `assets/extensions/${config.vendor}/${config.name}/css/[id].[contenthash].css`,
  }),
]

if (process.env.CI !== 'true') {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = merge(common, {
  mode: 'production',
  devtool: 'nosources-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          postcssRtl.rtlLoader,
        ]
      },
    ]
  },
  plugins,
});
