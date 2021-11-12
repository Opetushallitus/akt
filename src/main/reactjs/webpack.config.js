const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env) => {
  const mode = env.prod ? 'production' : 'development';

  return {
    mode,
    entry: path.join(__dirname, '..', 'reactjs', 'src', 'index.tsx'),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '..', 'reactjs', 'public', 'index.html'),
      }),
      new ESLintPlugin({
        extensions: ['ts', 'tsx'],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: [
            env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    devtool: env.prod ? 'source-map' : 'cheap-module-source-map',
    devServer: {
      open: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 4000,
    },
    stats: 'errors-warnings',
  };
};
