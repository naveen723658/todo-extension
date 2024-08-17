const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entry = {
  index: "./src/scripts/index.ts",
  content: "./src/scripts/content.ts",
  background: "./src/scripts/background.ts",
  inject: "./src/scripts/inject.ts",
};
const plugins = [
  new HtmlWebpackPlugin({
    title: "project",
    template: "src/index.html",
    chunks: ["index"],
  }),
  new CopyPlugin({
    patterns: [
      { from: "src/manifest.json", to: "[name][ext]" },
      { from: "src/public", to: "public" },
    ],
  }),
  new CleanWebpackPlugin(),
];

module.exports = {
  entry,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins,
};
