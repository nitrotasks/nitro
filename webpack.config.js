var path = require('path')
module.exports = {
  entry: {
    app: path.resolve( __dirname, 'source/js/index.jsx'),
  },
  output: {
    filename: 'generated/[name].js',
    path: path.resolve( __dirname, 'dist'),
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}