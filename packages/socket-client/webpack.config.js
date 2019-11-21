const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = [
  {
    name: 'server',
    entry: ['@babel/polyfill', './src/server'],
    target: 'node',
    stats: 'errors-only',
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      extensions: ['.js', '.json', '.ts']
    },
    devtool: 'source-map',
    externals: /^[a-z\-0-9]+$/,
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'server.js',
      libraryTarget: 'commonjs2'
    },
    plugins: [new CleanWebpackPlugin(path.resolve(__dirname, 'lib', 'server.*'))],
    module: {
      rules: [
        // {
        //   test: /\.js$/,
        //   exclude: /(node_modules)/,
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       babelrc: false,
        //       presets: [
        //         [
        //           '@babel/preset-env',
        //           {
        //             targets: {
        //               node: 10
        //             }
        //           }
        //         ]
        //       ]
        //     }
        //   }
        // },
        {
          test: /\.ts$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'ts-loader'
          }
        },
        {
          test: /\.pgsql$/,
          use: {
            loader: 'raw-loader'
          }
        }
      ]
    }
  }
];
