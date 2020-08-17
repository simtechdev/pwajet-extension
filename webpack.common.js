const path = require('path');
const babelPluginJsxOwner = require('babel-plugin-jsx-owner').default;
const config = require('./module.config');

module.exports = {
  stats: 'minimal',
  entry: {
    [config.name]: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: `assets/extensions/${config.vendor}/${config.name}/js/[name].[hash:8].js`,
    chunkFilename: `assets/extensions/${config.vendor}/${config.name}/js/[name].[hash:8].chunk.js`,
    publicPath: '/',
  },
  externals: {
    'react': 'React',
    'ReactDOM': 'react-dom',
    /**
     * To ability `import pwajet from 'pwajet'`
     */
    'pwajet': 'pwajet',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
            ],
            plugins: [
              babelPluginJsxOwner,
            ]
          }
        }]
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    splitChunks: {
      cacheGroups: {
        common: {
          maxSize: 3e+5,
          name: 'common',
          minChunks: 2,
          chunks: 'async',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        }
      },
    },
  },
};
