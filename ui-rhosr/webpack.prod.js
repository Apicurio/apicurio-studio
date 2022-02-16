const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
// webpack 5 stop handling node polyfills by itself, this plugin re-enables the feature

module.exports = merge(common("production"), {
  devtool: "source-map",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
      insert: (linkTag) => {
        const preloadLinkTag = document.createElement('link')
        preloadLinkTag.rel = 'preload'
        preloadLinkTag.as = 'style'
        preloadLinkTag.href = linkTag.href
        document.head.appendChild(preloadLinkTag)
        document.head.appendChild(linkTag)
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules/patternfly"),
          path.resolve(__dirname, "node_modules/@patternfly/patternfly"),
          path.resolve(
            __dirname,
            "node_modules/@patternfly/react-core/dist/styles/base.css"
          ),
          path.resolve(
            __dirname,
            "node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly"
          ),
          path.resolve(__dirname, "node_modules/@patternfly/react-styles/css"),
        ],
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  output: {
    filename: "[name].bundle.[contenthash].js",
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new CssMinimizerPlugin({
        minimizerOptions: {         
            preset: ['default', { mergeLonghand: false }] // Fixes bug in PF Select component https://github.com/patternfly/patternfly-react/issues/5650#issuecomment-822667560
         }
      })
    ],
  },
});
