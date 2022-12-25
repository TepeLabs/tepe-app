const { defineConfig } = require("@vue/cli-service");
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        os: false,
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        secretjs: false,
        "crypto-browserify": require.resolve("crypto-browserify"),
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      builderOptions: {
        appId: "com.electron.tepe",
        productName: "Tepe",
        mac: {
          icon: "src/assets/icon.icns"
        }
      }
    },
  },
});
