/* eslint-env node */
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            'template': './index.html'
        }),
        new WorkboxPlugin({
            globDirectory: 'dist',
            globPatterns: ['**/*.{html,js,css,ico}'],
            swDest: path.join('dist', 'sw.js'),
            clientsClaim: true,
            skipWaiting: true,
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    }
}