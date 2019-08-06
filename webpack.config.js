const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = (env, argv) => ({
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, '/.dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '@micelord/grider',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
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
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    })
  ]
})