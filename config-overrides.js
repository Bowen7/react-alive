const { override, addWebpackPlugin } = require('customize-cra')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const path = require('path')

module.exports = override(
  addWebpackPlugin(
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/sw.js'),
    })
  )
)
