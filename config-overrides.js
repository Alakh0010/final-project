const { override, addWebpackPlugin, addWebpackAlias } = require('customize-cra');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Add bundle analyzer in production
  if (process.env.ANALYZE === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false,
      })
    );
  }

  // Optimize moment.js locale imports
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^(\.\/locale\/|date-fns\/)/,
      contextRegExp: /moment$/
    })
  );

  // Configure CSS Modules
  const rules = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
  const cssModuleRule = rules.find(
    rule => rule.test && rule.test.toString().includes('css')
  );

  if (cssModuleRule) {
    cssModuleRule.use = cssModuleRule.use.map(loader => {
      if (loader.loader && loader.loader.includes('postcss-loader')) {
        return {
          ...loader,
          options: {
            ...loader.options,
            postcssOptions: {
              plugins: {
                tailwindcss: {},
                autoprefixer: {},
              },
            },
          },
        };
      }
      return loader;
    });
  }

  // Add webpack aliases
  return addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@context': path.resolve(__dirname, 'src/context'),
  })(config);
};
