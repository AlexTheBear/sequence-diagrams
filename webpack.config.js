var path = require('path');

module.exports = {
  entry: './src/main.js',
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
      }
    ]
  },
  node: {
    fs: "empty"
  }
};
