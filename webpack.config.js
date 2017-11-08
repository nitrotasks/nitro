const path = require('path')
const baseDirectory = __dirname
const buildPath = path.resolve(baseDirectory, './dist')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass = new ExtractTextPlugin({
  filename: 'generated/[name].css'
})

const webpackConfig = {
  context: baseDirectory,
  entry: {
    app: ['./source/js/index.jsx', './source/scss/style.scss'],
  },
  output: {
    filename: 'generated/[name].js',
    chunkFilename: 'generated/[name].js',
    path: buildPath,
    publicPath: '/',
  },
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader' },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            },
          }, {
            loader: 'resolve-url-loader'
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            },
          }],
          // use style-loader in development
          fallback: 'style-loader'
        })
      },
      {
        test: /pikaday\.js$/,
        loader : 'imports-loader?define=>false'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    proxy: {
      '/a': {
        target: 'http://localhost:8040',
      }
    }
  },
  plugins: [
    extractSass,
    new webpack.IgnorePlugin(/moment/)
  ]
}


const bundle = new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  openAnalyzer: false
})
if (process.env.NODE_ENV === 'production') {
  delete webpackConfig.devtool
  webpackConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
  webpackConfig.plugins.push(bundle)
} else if (process.env.NODE_ENV === 'report') {
  webpackConfig.plugins.push(bundle)
}

module.exports = webpackConfig