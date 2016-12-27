module.exports = {
  entry: {
    app: './source/index.jsx'
  },
  output: {
    filename: 'generated/[name].js',
    path: './dist'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}