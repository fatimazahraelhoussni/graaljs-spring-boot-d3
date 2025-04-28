const path = require('path');

module.exports = {
  entry: './graph.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'graph.bundle.js',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  mode: 'production', // or 'development' during testing
  target: 'web', // or 'browserslist' for more flexibility
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // optional if you need ES6 transpilation
        },
      },
    ],
  },
};
