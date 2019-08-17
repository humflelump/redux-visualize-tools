const path = require('path');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

module.exports = env => ({
  entry: './src/index.tsx',
  mode: env.NODE_ENV,
  // plugins: [new BundleAnalyzerPlugin()],
  module: {
    rules: [
      {
        test: /\.txt.js$/i,
        use: 'raw-loader',
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output: {
    filename: 'index.js',
    path:
      __dirname
        .split('/')
        .slice(0, -1)
        .join('/') + '/core/injected-code-dist',
  },
});
