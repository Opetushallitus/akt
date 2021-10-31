const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  const mode = env.production ? "production" : "development";

  return {
    mode,
    entry: path.join(__dirname, "..", "frontend", "src", "index.tsx"),
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
      new HtmlWebpackPlugin({
        template: path.join(
          __dirname,
          "..",
          "frontend",
          "public",
          "index.html"
        ),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: [
            env.production ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    stats: "errors-only",
  };
};
