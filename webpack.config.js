const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');


module.exports = {
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: /node_modules/,
    }]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
};
