const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  performance: {
    maxEntrypointSize: 300000,
    maxAssetSize: 300000,
  }
});
