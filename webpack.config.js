let HtmlPlugin = require('html-webpack-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let path = require('path');

module.exports = {
	entry: {
		main: './src/index.js'
	},
	devServer: {
		index: 'index.html'
	},
	output: {
		filename: '[name].[hash].js',
		path: path.resolve('dist')
	},
	devtool: 'source-map',
	module: { 
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					'sass-loader'
				]
			},
			// {
			// 	test: /\.hbs/,
			// 	loader: 'handlebars-loader'
			// },
			{
				test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/i,
				loader: 'file-loader',
				options: {
					name: '[hash:8].[ext]',
					outputPath: 'resources'
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new UglifyJsPlugin({
			sourceMap: true,
			uglifyOptions: {
				compress: {
					drop_debugger: false
				}
			}
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new HtmlPlugin({
			title: 'API Yandex Maps',
			template: 'src/index.html',
			filename: 'index.html',
			chunks: ['main']
		})
	]
};
