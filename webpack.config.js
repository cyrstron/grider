const path = require('path');

module.exports = (env, argv) => ({
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
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : 'source-map',
  plugins: []
})