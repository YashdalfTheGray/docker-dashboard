const { resolve } = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = (mode) => mode === 'development';
const isProd = (mode) => mode === 'production';

module.exports = (_, argv) => ({
  entry: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    'webpack-hot-middleware/client',
    './app/index.tsx',
  ],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, './public'),
    publicPath: '/',
    hotUpdateChunkFilename: '.hot/[id].[contenthash].hot-update.js',
    hotUpdateMainFilename: '.hot/[contenthash].hot-update.json',
  },
  devtool: 'source-map',
  mode: argv.mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'ts-loader',
            options: { configFile: 'tsconfig.client.json' },
          },
        ].concat(isProd(argv.mode) ? [{ loader: 'webpack-remove-debug' }] : []),
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['public/*.js', 'public/*.js.map'],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  stats: {
    colors: true,
  },
});
