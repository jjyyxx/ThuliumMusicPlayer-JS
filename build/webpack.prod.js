const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin(),
        new CopyWebpackPlugin([
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs',
            }
        ]),
    ]
});