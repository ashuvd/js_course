let HtmlPlugin = require('html-webpack-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let MiniCSSExtractPlugin = require('mini-css-extract-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let rules = require('./webpack.config.rules');
let path = require('path');

rules.push({
    test: /\.css$/,
    use: [
        MiniCSSExtractPlugin.loader,
        {
            loader: 'style-loader' 
        },
        {
            loader: 'css-loader' 
        }
    ]
});

module.exports = {
    entry: {
        main: './src/cookie.js'
    },
    devServer: {
        index: 'index.html'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: { rules },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    drop_debugger: false
                }
            }
        }),
        new MiniCSSExtractPlugin('styles.css'),
        new HtmlPlugin({
            title: 'Main Homework',
            template: 'src/cookie.hbs',
            filename: 'index.html',
            chunks: ['main']
        }),
        new CleanWebpackPlugin()
    ]
};
