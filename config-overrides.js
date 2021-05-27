const { override, addWebpackPlugin } = require("customize-cra")
const OfflinePlugin = require("offline-plugin")
const path = require("path")

module.exports = override(
  addWebpackPlugin(
    new OfflinePlugin({
      excludes: ["**/*"],
      ServiceWorker: { entry: path.resolve(__dirname, "./src/sw.js") },
    })
  )
)
