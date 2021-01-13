const path = require('path');

module.exports = {
  entry: './src/JS/game.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
    port: 8080,
  },
  externals: {
    ml5: 'ml5',
    p5: 'p5',
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg|wav)$/i,
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
};