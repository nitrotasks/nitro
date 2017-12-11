const path = require('path')
const baseDirectory = __dirname
const buildPath = path.resolve(baseDirectory, './dist')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass = new ExtractTextPlugin({
  filename: 'generated/[name].css'
})
const OfflinePlugin = require('offline-plugin')

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
      },
      '/a/ws': {
        target: 'ws://localhost:8040',
        ws: true
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    extractSass,
    new webpack.IgnorePlugin(/moment/)
  ]
}


const bundle = new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  openAnalyzer: false
})
if (process.env.NODE_ENV === 'production') {
  webpackConfig.devtool = 'nosources-source-map'
  webpackConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
  webpackConfig.plugins.push(bundle)
  webpackConfig.plugins.push(new OfflinePlugin({
    externals: [
      '/',
      '/fonts/Raleway.woff2',
      '/fonts/Raleway-Ext.woff2',
      '/fonts/Raleway-SemiBold.woff2',
      '/fonts/Raleway-SemiBold-Ext.woff2',
      '/fonts/Raleway-Black.woff2',
      '/fonts/Raleway-Black-Ext.woff2',
    ],
    ServiceWorker: {
      navigateFallbackURL: '/'
    }
  }))
} else if (process.env.NODE_ENV === 'report') {
  webpackConfig.plugins.push(bundle)
}

module.exports = webpackConfig