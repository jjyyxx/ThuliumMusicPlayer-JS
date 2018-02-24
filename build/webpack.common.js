/* eslint-env node */
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js'
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    }
}