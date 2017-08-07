module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'ts-merger.umd.js',
        path: __dirname + '/dist',
        libraryTarget: "umd",
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    node: {
        fs: "empty",
        child_process: 'empty'
    }
};