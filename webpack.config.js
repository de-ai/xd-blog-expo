module.exports = {
  entry: "./src/main.jsx",
  output: {
    path: __dirname,
      filename: 'main.js',
      libraryTarget: "commonjs2"
  },
  devtool: "none", // prevent webpack from using eval() on my module
  externals: {
    application: "application",
    scenegraph: "scenegraph",
    viewport: "viewport",
	  uxp: "uxp"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        plugins: [
          "transform-react-jsx",
          "transform-object-rest-spread",
          "transform-class-properties"
        ]
      }
    }, {
      test: /\.png$/,
      exclude: /node_modules/,
      loader: 'file-loader'
    }, {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    }]
  }
};
