const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// webpack 5 stop handling node polyfills by itself, this plugin re-enables the feature
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { federatedModuleName, dependencies } = require("./package.json");
const ChunkMapper = require("@redhat-cloud-services/frontend-components-config/chunk-mapper");


const cmdArgs = {};
process.argv.forEach(arg => {
  if (arg && arg.startsWith("--env=")) {
    const idx = arg.indexOf(":");
    const name = arg.substring(6, idx);
    const value = arg.substring(idx+1);
    cmdArgs[name] = value;
  }
});


module.exports = (mode) => {
  const isProduction = mode === "production";
  console.info("Is production build? %o", isProduction);
  return {
    mode,
    entry: {
      app: "./src/index.tsx"
    },
    plugins: [
      new NodePolyfillPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      }),
      new ChunkMapper({
        modules: [
          federatedModuleName
        ]
      }),
      new ModuleFederationPlugin({
        name: federatedModuleName,
        filename: `${federatedModuleName}${
            (isProduction) ? ".[chunkhash:8]" : ""
        }.js`,
        exposes: {
          "./FederatedApisPage": "./src/app/pages/apis/apis.federated",
          "./FederatedTeamsPage": "./src/app/pages/teams/teams.federated"
        },
        shared: {
          ...dependencies,
          react: {
            eager: true,
            singleton: true,
            requiredVersion: dependencies["react"],
          },
          "react-dom": {
            eager: true,
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "react-router-dom": {
            singleton: true,
            eager: true,
            requiredVersion: dependencies["react-router-dom"],
          },
        }
      })
    ],
    module: {
      rules: [
        // fixes issue with babel dependencies not declaring the package correctly for webpack 5
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },
        // fixes issue with yaml dependency not declaring the package correctly for webpack 5
        {
          test: /node_modules[\\\/]yaml[\\\/]browser[\\\/]dist[\\\/].*/,
          type: "javascript/auto"
        },
        {
          test: /\.(tsx|ts)?$/,
          include: path.resolve(__dirname, "src"),
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              }
            }
          ]
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          // only process modules with this loader
          // if they live under a "fonts" or "pficon" directory
          include: [
            path.resolve(__dirname, "node_modules/patternfly/dist/fonts"),
            path.resolve(__dirname, "node_modules/@patternfly/react-core/dist/styles/assets/fonts"),
            path.resolve(__dirname, "node_modules/@patternfly/react-core/dist/styles/assets/pficon"),
          ],
          use: {
            loader: "file-loader",
            options: {
              // Limit at 50k. larger files emited into separate files
              limit: 5000,
              outputPath: "fonts",
              name: isProduction ? '[contenthash:8].[ext]' : '[name].[ext]',
            }
          }
        },
        {
          test: /\.svg$/,
          include: input => input.indexOf("background-filter.svg") > 1,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 5000,
                outputPath: "svgs",
                name: isProduction ? '[contenthash:8].[ext]' : '[name].[ext]',
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader if they live under a "bgimages" directory
          // this is primarily useful when applying a CSS background using an SVG
          include: input => input.indexOf("bgimages") > -1,
          use: {
            loader: "svg-url-loader",
            options: {}
          }
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader when they don"t live under a "bgimages",
          // "fonts", or "pficon" directory, those are handled with other loaders
          include: input => (
            (input.indexOf("bgimages") === -1) &&
            (input.indexOf("fonts") === -1) &&
            (input.indexOf("background-filter") === -1) &&
            (input.indexOf("pficon") === -1)
          ),
          use: {
            loader: "raw-loader",
            options: {}
          }
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          include: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules/patternfly"),
            path.resolve(__dirname, "node_modules/@patternfly/patternfly/assets"),
            path.resolve(__dirname, "node_modules/@patternfly/react-core/dist/styles/assets/images"),
            path.resolve(__dirname, "node_modules/@patternfly/react-styles/css/assets/images")
          ],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 5000,
                outputPath: "images",
                name: isProduction ? '[contenthash:8].[ext]' : '[name].[ext]',
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "./tsconfig.json")
        })
      ],
      symlinks: false,
      cacheWithContext: false
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "auto"
    },
    performance: {
      hints: false,
      maxEntrypointSize: 2097152,
      maxAssetSize: 1048576
    }
  }
};
