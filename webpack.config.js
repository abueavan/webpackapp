/* eslint-disable no-undef */
const path = require('path')
const webpack = require('webpack')

const config =(env, argv) => {
  console.log('argv', argv.mode)

  const backend_url = argv.mode === 'production'
    ? 'https://radiant-plateau-25399.herokuapp.com/api/notes'
    : 'http://localhost:3001/notes'

  return {
    entry: ['@babel/polyfill','./src/index.js'],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
      proxy: {
        '/api': {  //捕获API的标志，如果API中有这个字符串，那么就开始匹配代理
          target: 'http://localhost:3003',  //将捕获到的API，代理到target
          //pathRewrite: { '^/api' : '' },
          changeOrigin: true,     // target是域名的话，需要这个参数，
          secure: false,          // 设置支持https协议的代理
        }
      }
    },
    devtool: 'source-map',// 出错是找源码而不是打包后的代码
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env','@babel/preset-react']
          }
        },
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
  }
}
module.exports = config