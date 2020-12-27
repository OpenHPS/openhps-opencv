const PROJECT_NAME = "openhps-opencv";
const LIBRARY_NAME = "@openhps/opencv";

const path = require('path');

module.exports = env => [
  {
    name: PROJECT_NAME,
    mode: env.prod ? "production" : "development",
    entry: `./dist/cjs/index.web.js`,
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `web/${PROJECT_NAME}${env.prod ? ".min" : ""}.${env.module ? 'mjs' : 'js'}`,
      library: LIBRARY_NAME,
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    externals: ["@openhps/core"],
    resolve: {
      alias: {
        typescript: false,
        opencv4nodejs: path.resolve(__dirname, "lib/opencv@4.5.1.js")
      },
      fallback: {
        path: false,
        fs: false,
        os: false,
      }
    },
    optimization: {
      minimize: env.prod,
      portableRecords: true,
      usedExports: true,
      providedExports: true
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  }
];
