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
        test: /\.worker\.ts$/,
        use: [{ 
          loader: 'worker-loader',
          options: { inline: true, fallback: false }
        }, {
          loader: 'ts-loader'
        }],
      },
      { 
        test: /\.ts$/, 
        loader: 'ts-loader',
        exclude: [/\.worker\.ts$/]
      }
    ]
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : 'source-map',
  plugins: []
})