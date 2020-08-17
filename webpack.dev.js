const { merge } = require('webpack-merge');
const address = require('address');
const path = require('path');
const url = require('url');
const common = require('./webpack.common.js');
const chalk = require('chalk');
const postcssRtl = require('./webpack/postcss-rtl');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const forOwn = require('lodash/forOwn');

let lanUrlForConfig = '';
let lanUrlForTerminal = '';

const options = {};
// convert process.env variables to options
forOwn(process.env, (value, name) => options[name.replace('process.env.', '')] = value.replace(/"/g, ''))

try {
  // This can only return an IPv4 address
  lanUrlForConfig = address.ip();
  if (lanUrlForConfig) {
    // Check if the address is a private ip
    // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
    if (
      /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
        lanUrlForConfig
      )
    ) {
      // Address is private, format it for later use
      lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
    } else {
      // Address is not private, so we will discard it
      lanUrlForConfig = undefined;
    }
  }
} catch (_e) {
  // ignored
}

const prettyPrintUrl = (hostname, options) =>
url.format({
  protocol: options.https ? 'https' : 'http',
  hostname,
  port: chalk.bold(options.port),
  pathname: options.publicPath,
});

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          {
            loader: 'css-loader', options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader'
          },
          postcssRtl.rtlLoader,
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{
        from: 'public',
        globOptions: {
          ignore: ['**/index.html']
        }
      }]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      inject: true,
    }),
  ],
  devServer: {
    before: function(app, server) {
      printInstructions({
        localUrlForTerminal: prettyPrintUrl('localhost', server.options),
        lanUrlForTerminal: prettyPrintUrl(lanUrlForConfig, server.options)
      })
    },
    contentBase: 'build',
    watchContentBase: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    inline: true,
    compress: true,
    useLocalIp: true,
    host: '0.0.0.0',
  },
});

function printInstructions(urls) {
  console.log();
  console.log(`You can now view the app in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(
      `  ${chalk.bold('Local:')}            ${chalk.blue.bold(urls.localUrlForTerminal)}`
    );
    console.log(
      `  ${chalk.bold('On Your Network:')}  ${chalk.blue.bold(urls.lanUrlForTerminal)}`
    );
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(
    `To create a production build, use ` +
      `${chalk.cyan('yarn build')}.`
  );
  console.log();
}
