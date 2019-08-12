const path = require("path");

module.exports = {
  entry: "./index.js",
  mode: "production",
  optimization: {
    minimize: true
  },
  output: {
    filename: "worker.txt",
    path:
      __dirname
        .split("/")
        .slice(0, -1)
        .join("/") + "/injected-code/src/gen-graph-layout"
  }
};
