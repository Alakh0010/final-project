const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { override, addWebpackPlugin } = require('customize-cra');

module.exports = function (config, env) {
  // Add bundle analyzer plugin in production builds
  if (env === 'production') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false,
      })
    );
  }

  // Add other webpack configurations here if needed
  return config;
};

// This script should be used with react-app-rewired
// To use it, install the required dependencies:
// npm install --save-dev webpack-bundle-analyzer customize-cra react-app-rewired
