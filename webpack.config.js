// var path = require('path');

module.exports = {
    entry: './src/index.jsx',
     module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/],
 
}