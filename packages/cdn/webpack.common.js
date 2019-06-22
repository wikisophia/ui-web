const path = require('path');

module.exports = {
  entry: {
    argument: './src/pages/argument/index.jsx',
  },
  output: {
    filename: '[name].js',
    library: 'wikisophia',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    inline: true,
    contentBase: path.join(__dirname, 'dist'),
    host: 'localhost',
    port: 4041,
  },
};
