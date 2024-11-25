const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    target: 'electron-renderer',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            "path": require.resolve("path-browserify"),
            "fs": false,
            "os": require.resolve("os-browserify/browser"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/"),
            "assert": require.resolve("assert/")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    ]
}; 