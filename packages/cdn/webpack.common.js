
module.exports = {
  entry: {
    argument: './src/pages/argument/index.jsx',
    homepage: './src/pages/homepage/index.js',
    'new-argument': './src/pages/new-argument/index.jsx',
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
};
