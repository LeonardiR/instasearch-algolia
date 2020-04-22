const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const isDevelopment = process.env.NODE_ENV.trim() !== 'production';

module.exports = {
    entry: {
        polyfills: 'whatwg-fetch',
        main: "./src/main.js",
        detall: "./src/detall/index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].js",
    },
    resolve: {
    },
    devtool: isDevelopment && "source-map",
    devServer: {
        port: 3000,
        open: true,
        contentBase: path.join(__dirname, "/src"),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env',{
                                useBuiltIns: "usage",
                                corejs: 3
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            autoprefixer: {
                                browsers: ["last 2 versions"]
                            },
                            sourceMap: true,
                            plugins: () => [
                                autoprefixer({ grid: true }),
                                cssnano({ preset: 'default' })
                            ]
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDevelopment,
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts',
                            useRelativePath: true,
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg|mp4|webm)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/img',
                            useRelativePath: false
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: true,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            }
                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            title: 'Algolia Search Project',
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['polyfills', 'main'],
            minify: !isDevelopment && {
                html5: true
            },
        }),
        new HtmlWebpackPlugin({
            title: 'Detalle',
            filename: 'detall/detall.html',
            template: './src/detall/detall.html',
            chunks: ['detall'],
            minify: !isDevelopment && {
                html5: true
            },
        }),
    ]
};
