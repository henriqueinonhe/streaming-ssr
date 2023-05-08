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
    index: "./src/client/index.jsx",
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
  },
  output: {
    path: path.resolve(__dirname, "dist/server"),
    clean: true,
  },
  target: "node",
};

module.exports = [clientConfig, serverConfig];
