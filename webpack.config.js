const path = require('path');
const  DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, '/.dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '@micelord/grider',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        loader: 'ts-loader',
        options: {
          allowTsInNodeModules: true
        }
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  },
  devtool: 'source-map',
  plugins: []
}