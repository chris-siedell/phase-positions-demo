const path = require('path'); 
 
module.exports = {
  entry: './src/Main.js', 
  output: { 
            filename: 'PhasePositionsDemo.js', 
            path: path.resolve(__dirname, 'dist') 
          }, 
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, use: [{loader: 'babel-loader'}]},
      {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]
  }
};


