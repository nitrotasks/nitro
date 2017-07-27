var path = require('path');
var baseDirectory = __dirname
var buildPath = path.resolve(baseDirectory, './dist')
var webpack = require('webpack')

module.exports = {
  context: baseDirectory,
  entry: {
    app: './source/js/index.jsx',
  },
  output: {
    filename: 'generated/[name].js',
    path: buildPath,
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}