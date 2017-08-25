const path = require('path')
const baseDirectory = __dirname
const buildPath = path.resolve(baseDirectory, './dist')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

const webpackConfig = {
  context: baseDirectory,
  entry: {
    app: './source/js/index.jsx'
  },
  output: {
    filename: 'generated/[name].js',
    path: buildPath,
  },
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: []
}


if (process.env.NODE_ENV === 'production') {
  delete webpackConfig.devtool
  webpackConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
} else if (process.env.NODE_ENV === 'report') {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  )
}

module.exports = webpackConfig