import path from 'path';

module.exports = {
  entry: './calculator.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
};