"use strict";

const debug = (process.env.NODE_ENV !== "dev" && process.env.NODE_ENV !== "uat" && process.env.NODE_ENV !== "ppt" && process.env.NODE_ENV !== "prd");
const environment = process.env.NODE_ENV;
const webpack = require('webpack');
const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: debug ? 'cheap-module-eval-source-map' : false,
    entry: {
        app : [
            'whatwg-fetch',
            path.join(__dirname, 'src', 'app-client.js'),
            path.join(__dirname, 'src/visual/scss', 'public.scss')
        ],
    },
    devServer: {
        inline: true,
        port: 4444,
        contentBase: path.join(__dirname, 'www'),
        historyApiFallback: {
            index: '/index.html'
        }
    },
    output: {
        path: path.join(__dirname, 'www'),
        publicPath: '',
        filename: 'bundle.js'
    },
    resolve: {
        symlinks: false,
        alias : {
            'bo-tools' : path.resolve('node_modules/bo-tools'),
            react: path.resolve('./node_modules/react'),
            'react-router': path.resolve('./node_modules/react-router'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // Use of include to get bo-tools dependency used by babel compiler
                include: [
                    path.resolve(__dirname, "src")
                ],
                use: ['babel-loader', 'babel-loader?presets[]=react,presets[]=es2015']
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use : ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "url-loader?limit=600000&name=./img/[hash].[ext]"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?limit=6000000000&name=fonts/[hash].[ext]'
            },
            {
                test: /\.ttf?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?limit=6000000000&name=fonts/[hash].[ext]'
            },
            {
                test: /\.eot?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?limit=6000000000&name=fonts/[hash].[ext]'
            }
        ]
    },
    plugins: [
                new ExtractTextPlugin({
                    filename: 'css/style.css',
                    allChunks: true,
                }),
                new HtmlWebPackPlugin({
                    title: 'Recetas de Cocina',
                    minify: {
                        collapseWhitespace: true
                    },
                    hash: true,
                    filename: path.join(__dirname, 'www', 'index.html'),
                    favicon: path.join(__dirname, 'src/visual/img/favicon.ico'),
                    template: './src/views/index.ejs'
                })
            ]
};
