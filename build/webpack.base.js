'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')
const _ = require('./utils')
const entry = require('webpack-glob-entry')

module.exports = {
  entry: {
    client: entry('./src/index.[tj]s')
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.css', '.json'],
    alias: {
      root: path.join(__dirname, '../src'),
      components: path.join(__dirname, '../src/components')
    },
    modules: [
      _.cwd('node_modules'),
      // this meanse you can get rid of dot hell
      // for example import 'components/Foo' instead of import '../../components/Foo'
      _.cwd('src')
    ]
  },
  module: {
    loaders: [{
        test: /\.vue$/,
        loaders: ['vue-loader'],
        options: {
          loaders: {
            js: 'ts-loader',
          },
          esModule: true
        }
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/]
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      },
      {
        test: /\.es6$/,
        loaders: ['babel-loader']
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#cheap-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title,
      template: __dirname + '/index.html',
      filename: _.outputIndexPath,
      hash: true
    }),
    new webpack.LoaderOptionsPlugin(_.loadersOptions()),
    new CopyWebpackPlugin([{
      from: _.cwd('./static'),
      // to the roor of dist path
      to: './'
    }])
  ],
  target: _.target
}
