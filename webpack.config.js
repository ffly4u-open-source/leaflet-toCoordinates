const path = require('path');

const { NODE_ENV } = process.env;
const production = NODE_ENV === 'production';

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: ['./src/leaflet-toCoordinates.js', './src/leaflet.scss'],
  output: {
    filename: 'leaflet-toCoordinates.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'leaflet.css'
    }),
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserJSPlugin(),
    ]
  }
};
