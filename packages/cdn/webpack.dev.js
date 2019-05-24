const merge = require('webpack-merge');
const path = require('path');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    inline: true,
    contentBase: path.join(__dirname, 'dist'),
    host: 'localhost',
    port: 4041,
  },
});
