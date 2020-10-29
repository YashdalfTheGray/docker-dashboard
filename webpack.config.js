const { resolve } = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: [
    '@babel/polyfill',
    'webpack-hot-middleware/client',
    './app/index.tsx'
  ],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, './public'),
    publicPath: '/',
    hotUpdateChunkFilename: '.hot/[id].[chunkhash].hot-update.js',
    hotUpdateMainFilename: '.hot/[chunkhash].hot-update.json'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']
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
            options: { configFile: 'tsconfig.client.json' }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['public/*.js', 'public/*.js.map']
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  stats: {
    colors: true
  }
};
