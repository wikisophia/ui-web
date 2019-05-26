const merge = require('webpack-merge');
const prod = require('./webpack.prod.js');

// webpack-dev-server adds a bunch of overhead to the bundles it creates...
// so set the performance budget higher to silence warnings.
module.exports = merge(prod, {
  performance: {
    maxEntrypointSize: 380000,
    maxAssetSize: 380000,
  }
});
