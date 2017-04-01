var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/ui/render.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'sequencer',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.jison$/,
        use: 'raw-loader'
      },
      {
        test: /\.svg$/,
        use: 'raw-loader'
      }
    ]
  },
  node: {
    fs: "empty"
  },
  externals: {
    'fabric': 'var fabric'
  },
  plugins: [
    new HtmlWebpackPlugin({template:'./src/ui/index.html'})
  ]
};
