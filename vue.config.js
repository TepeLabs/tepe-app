const { defineConfig } = require("@vue/cli-service")

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "os": false,
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "secretjs": false,
        "crypto-browserify": require.resolve("crypto-browserify"),
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js'
    }
  },
})
