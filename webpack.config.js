const path = require('path')
const baseDirectory = __dirname
const buildPath = path.resolve(baseDirectory, './dist')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const webpack = require('webpack')
const OfflinePlugin = require('offline-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'

let filename = 'generated/[name].js'
let chunkFilename = 'generated/[name].[id].js'
if (!devMode) {
  filename = 'generated/[name].[hash].js'
  chunkFilename = 'generated/[name].[id].[chunkhash].js'
}

const webpackConfig = {
  context: baseDirectory,
  entry: {
    app: ['./config/index.js', './nitro.ui/index.js']
  },
  output: {
    filename: filename,
    chunkFilename: chunkFilename,
    path: buildPath,
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader' },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'generated/assets/'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
      '/a': {
        target: 'http://localhost:8040',
        pathRewrite: { '^/a': '' }
      },
      '/a/ws': {
        target: 'ws://localhost:8040',
        pathRewrite: { '^/a': '' },
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
    new MiniCssExtractPlugin({
      filename: 'generated/[name].[hash].css',
      chunkFilename: 'generated/[id].[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: 'nitro.ui/index.html',
      title: 'Nitro'
    })
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
  webpackConfig.plugins.push(
    new OfflinePlugin({
      appShell: '/',
      externals: [
        '/img/favicon/favicon-48x48.png',
        '/img/favicon/favicon-32x32.png',
        '/img/favicon/favicon-16x16.png'
      ],
      AppCache: false,
      ServiceWorker: {
        minify: false
      }
    })
  )
}

module.exports = webpackConfig
