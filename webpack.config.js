const path = require('path')
const baseDirectory = __dirname
const buildPath = path.resolve(baseDirectory, './dist')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
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
    rules: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader' },
      {
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].css',
							outputPath: 'generated/'
						}
					},
					{
						loader: 'extract-loader',
						options: { publicPath: '' }
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
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