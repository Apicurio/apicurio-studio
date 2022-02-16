const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "8888";

module.exports = merge(common('development'), {
  devtool: "eval-source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {from: "./src/version.js"},
        {from: "./src/config.js"},
        {from: "./src/favicon.ico"},
      ]})
  ],
  devServer: {
    contentBase: "./dist",
    host: HOST,
    port: PORT,
    compress: true,
    inline: true,
    historyApiFallback: true,
    hot: true,
    overlay: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules/patternfly"),
          path.resolve(__dirname, "node_modules/@patternfly/patternfly"),
          path.resolve(__dirname, "node_modules/@patternfly/react-styles/css"),
          path.resolve(__dirname, "node_modules/@patternfly/react-core/dist/styles/base.css"),
          path.resolve(__dirname, "node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly")
        ],
        use: ["style-loader", "css-loader"]
      }
    ]
  }
});
