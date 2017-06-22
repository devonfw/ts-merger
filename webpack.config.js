module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'tsmerger.js',
    path: __dirname + '/dist',
    libraryTarget: "commonjs",
  },
  target: 'node',
  module: {
    rules: [
      {
        loader: 'ts-loader',
        exclude: [/node_modules/, /test/, /dist/]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};