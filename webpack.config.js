const { resolve } = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', './app/index.tsx'],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, './public')
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
  plugins: [new CleanWebpackPlugin(['public/*.js', 'public/*.js.map'])],
  stats: {
    colors: true
  }
};
