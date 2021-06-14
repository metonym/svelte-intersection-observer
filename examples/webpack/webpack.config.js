const { ESBuildMinifyPlugin } = require("esbuild-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";
const PROD = NODE_ENV === "production";

module.exports = {
  entry: { "build/bundle": ["./src/index.js"] },
  resolve: {
    alias: { svelte: path.dirname(require.resolve("svelte/package.json")) },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "/public"),
    filename: PROD ? "[name].[contenthash].js" : "[name].js",
    chunkFilename: "[name].[id].js",
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: false,
            hotReload: !PROD,
            compilerOptions: { dev: !PROD },
          },
        },
      },
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: { fullySpecified: false },
      },
    ],
  },
  mode: NODE_ENV,
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </head>
        <body></body>
      </html>
      `,
    }),
  ],
  stats: "errors-only",
  devtool: PROD ? false : "source-map",
  devServer: { hot: true, historyApiFallback: true },
  optimization: {
    minimizer: [new ESBuildMinifyPlugin({ target: "es2015" })],
  },
};
