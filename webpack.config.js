module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'tsmerger.js',
    path: __dirname + '/dist'
  },
  target: 'node',
  module: {
    rules: [
      {
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  node: {
    fs: "empty"
  }
};