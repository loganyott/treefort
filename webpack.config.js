const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
  // Allows for dynamic entry files based upon what is in the serverless.yml. That means one source of truth!
  entry: slsw.lib.entries,
  /*
   * Here we completely ignore adding all of the files in node_modules because we assume that they'll be available in
   * the runtime. The files are imported by serverless webpack due to the configuration `webpackIncludeModules: true`
   * and are loaded into the node environment at runtime.
   */
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
