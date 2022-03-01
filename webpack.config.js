"use strict";

const path = require("path");
// const webpack = require('webpack')
const WebpackBar = require("webpackbar");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 生成动态title
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 每次打包前清除dist文件,重新生成
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin"); // 命令行提示
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
// 环境变量定义
// const envPlugin = new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) })

// 输出内容清单
const manifest = {};
const manifestPlugin = new WebpackManifestPlugin({
  seed: manifest,
  fileName: "asset-manifest.json",
});

// 打包进度条
const webpackbar = new WebpackBar();

module.exports = {
  mode: "production",
  entry: {
    index: "./src/main.tsx",
    // vendor: ['react'] // 这里是依赖的库文件配置，和CommonsChunkPlugin配合使用可以单独打包
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name]-[contenthash].js",
    publicPath: "/",
  },
  plugins: [
    manifestPlugin,
    webpackbar,
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      filename: "index.html",
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin({ clearConsole: true }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./public"), //打包的静态资源目录地址
          to: path.resolve(__dirname, "./build/public"), //打包到build下面的public
        },
      ],
    }),
  ],
  module: {
    // 引入 babel, 进行文件的转换编译,其中包括: js css 静态资源 es6转义为浏览器可编译文件(bable-cro)
    rules: [
      // JavaScript
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      // tsx 配置
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      // Fonts and SVGs
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
      // CSS, PostCSS, and Sass
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  devtool: "inline-source-map", // 追踪代码和给出错误代码出现的地方的提示
  resolve: {
    alias: {
      "@@": path.resolve(__dirname, "./src"),
    },
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
};
