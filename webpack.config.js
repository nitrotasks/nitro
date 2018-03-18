const path = require('path')
const baseDirectory = __dirname
const buildPath = path.resolve(baseDirectory, './dist')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const OfflinePlugin = require('offline-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

let filename = 'generated/[name].js'
let chunkFilename = 'generated/[name].[id].js'
let cssFilename = 'generated/[name].css'
if (process.env.NODE_ENV === 'production') {
  filename = 'generated/[name].[chunkhash].js'
  chunkFilename = 'generated/[name].[id].[chunkhash].js'
  cssFilename = 'generated/[name].[hash].css'
}

const extractSass = new ExtractTextPlugin({
  filename: cssFilename,
  allChunks: true
})

const webpackConfig = {
  context: baseDirectory,
  entry: {
    app: ['./source/js/index.jsx', './source/scss/style.scss'],
  },
  output: {
    filename: filename,
    chunkFilename: chunkFilename,
    path: buildPath,
    publicPath: '/',
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader' },
      {
				test: /\.scss$/,
				use: extractSass.extract({
				  use: [
  					{
  						loader: 'css-loader',
  						options: {
  						  sourceMap: true
  						}
  					},
  					{
  					  loader: 'resolve-url-loader'
  					},
  					{
  						loader: 'sass-loader',
  						options: {
  						  sourceMap: true
  						}
  					}
  				]
				})
			},
      {
        test:  /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'generated/assets/',
              publicPath: '/generated/assets'
            }
        }]
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
    disableHostCheck: true,
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
    new webpack.IgnorePlugin(/moment/),
    new HtmlWebpackPlugin({
      template: 'source/index.html',
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
  //webpackConfig.plugins.push(bundle)
  webpackConfig.plugins.push(new OfflinePlugin({
    externals: [
      '/',
    ],
    ServiceWorker: {
      navigateFallbackURL: '/',
      minify: false
    }
  }))
} else if (process.env.NODE_ENV === 'report') {
  webpackConfig.plugins.push(bundle)
}

module.exports = webpackConfig