const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    // localhost:8080 looks for index.js
    index: './src/index.js',
    about: './src/about.js',
    contacts: './src/contacts.js'
  },
  
  devServer: {
    port: 8080
  },
  
  plugins: [
    // Ignore fs in /wasm folder
    new webpack.IgnorePlugin(
      /fs/,
      /wasm$/
    ),
    
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/about.html',
      inject: true,
      chunks: ['about'],
      filename: 'about.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/contacts.html',
      inject: true,
      chunks: ['contacts'],
      filename: 'contacts.html'
    })
  ],
  
  module: {
    // Disable default rules
    defaultRules: [],
    rules: [
      {
        oneOf: [
//           {
//             test: /(\.mjs|\.esm\.js)$/i,
//             type: 'javascript/esm',
//             resolve: {},
//             parser: {
//               harmony: true,
//               amd: false,
//               commonjs: false,
//               system: false,
//               requireInclude: false,
//               requireEnsure: false,
//               requireContext: false,
//               browserify: false,
//               requireJs: false,
//               node: false
//             }
//           },
          {
            type: 'javascript/auto',
            resolve: {},
            parser: {
              system: false,
              requireJs: false
            }
          }
        ]
      },
//       {
//         test: /\.css$/,
//         use: [
//           'style-loader',
//           'css-loader'
//         ]
//       },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\/wasm\/.*\.js$/,
        loader: "exports-loader"
      },
      // The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
      {
        test: /\/wasm\/.*\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          name: '[name].[hash:5].[ext]',
        },
      }
    ]
  },
  
  node: {
    console: false,
    // Keep global, it's just an alias of window and used by many third party modules:
    global: true,
    // Turn off process to avoid bundling a nextTick implementation:
    process: false,
    // Inline __filename and __dirname values:
    __filename: 'mock',
    __dirname: 'mock',
    // Never embed a portable implementation of Node's Buffer module:
    Buffer: false,
    // Never embed a setImmediate implementation:
    setImmediate: false
  },
  
};


