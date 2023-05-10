const path = require("path");

const sharedConfig = {
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  mode: process.env.NODE_ENV,
  plugins: [],
};

const clientConfig = {
  ...sharedConfig,
  entry: {
    host: "./src/client/host.jsx",
    index: "./src/client/index.jsx",
    worker: "./src/client/worker.js",
    initiateWorker: "./src/client/initiateWorker.js",
  },
  output: {
    path: path.resolve(__dirname, "dist/client"),
    clean: true,
  },
  target: "web",
};

const serverConfig = {
  ...sharedConfig,
  entry: {
    index: "./src/server/index.jsx",
    worker: "./src/server/worker.jsx",
  },
  output: {
    path: path.resolve(__dirname, "dist/server"),
    clean: true,
  },
  target: "node",
};

module.exports = [clientConfig, serverConfig];
