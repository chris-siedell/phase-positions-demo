const path = require('path'); 
 
module.exports = {
  entry: './src/Main.js', 
  output: { 
            filename: 'PhaseDemo.js', 
            path: path.resolve(__dirname, 'dist') 
          }, 
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, use: [{loader: 'babel-loader'}]},
      {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]
  }
};


