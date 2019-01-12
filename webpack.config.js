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
const AssetsWebpackPlugin = require('assets-webpack-plugin')

const commonConfig = {
  context: baseDirectory,
  entry: {
    app: ['./config/index.js', './nitro.ui/index.js']
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
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
    new MiniCssExtractPlugin({
      filename: 'generated/[name].[contenthash].css',
      chunkFilename: 'generated/[id].[contenthash].css'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  commonConfig.devtool = 'nosources-source-map'
}

const legacyConfig = {
  ...commonConfig,
  name: 'client-legacy',
  output: {
    filename: 'generated/[name].[hash].js',
    chunkFilename: 'generated/[name].[id].[chunkhash].js',
    path: buildPath,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            envName: 'legacy' // Points to env.legacy in babel.config.js
          }
        }
      },
      {
        test: /\.css$/,
        use: 'null-loader'
      },
      ...commonConfig.module.rules
    ]
  },
  plugins: [
    ...commonConfig.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BUILD_ENV: JSON.stringify('legacy')
      }
    }),
    new AssetsWebpackPlugin({
      filename: 'assets.legacy.json',
      fileTypes: ['js', 'mjs']
    })
  ]
}
const modernConfig = {
  ...commonConfig,
  name: 'client-modern',
  output: {
    filename: 'generated/[name].[hash].mjs.js',
    chunkFilename: 'generated/[name].[id].[chunkhash].mjs.js',
    path: buildPath,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            envName: 'modern' // Points to env.modern in babel.config.js
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      ...commonConfig.module.rules
    ]
  },
  plugins: [
    ...commonConfig.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BUILD_ENV: JSON.stringify('modern')
      }
    }),
    new HtmlWebpackPlugin({
      template: 'nitro.ui/index.html',
      title: 'Nitro',
      chunks: devMode ? undefined : []
    }),
    new AssetsWebpackPlugin({
      filename: 'assets.json',
      fileTypes: ['js', 'mjs']
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  // doesn't support mjs
  legacyConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  )
  modernConfig.plugins.push(
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

module.exports = [legacyConfig, modernConfig]
