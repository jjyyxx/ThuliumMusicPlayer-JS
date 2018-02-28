const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const path = require('path')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new UglifyJSPlugin(),
        new CopyWebpackPlugin([
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs'
            }
        ]),
        new WorkboxPlugin({
            globDirectory: 'dist',
            globPatterns: [
                '**/*.{html,js,css,png}'
            ],
            swDest: path.join('dist', 'sw.js'),
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: /https:\/\/jjyyxx\.github\.io\/webaudiofontdata\/data\//,
                    handler: 'cacheFirst'
                }
            ]
        })
    ]
})