const path = require('path');

module.exports = function (rootDir) {
  const env = 'test';

  return {
    devtool: 'inline-source-map',

    resolve: {

      extensions: ['.ts', '.js'],
      modules: [path.resolve(rootDir, "src"), 'node_modules']
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            path.resolve(rootDir, "node_modules/rxjs"),
            path.resolve(rootDir, "node_modules/@angular"),
            path.resolve(rootDir, "node_modules/@types")
          ]
        },

        {
          test: /\.ts$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              query: {
                sourceMap: false,
                inlineSourceMap: true,
                compilerOptions: {
                  removeComments: true
                }
              },
            },
            {
              loader: 'angular2-template-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: 'css-loader',
              options: {
                'resolve url': true
              }
            }
          ]
        },
        {
          enforce: 'post',
          test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          include: path.resolve(rootDir, "src"),
          exclude: [
            /\.(spec)\.ts$/,
            /node_modules/
          ]
        }
      ]
    },

    // plugins: [],

    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
