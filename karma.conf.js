module.exports = function (config) {
  const testWebpackConfig = require('./config/webpack.test.js')(__dirname);

  const configuration = {

    basePath: '',
    frameworks: ['jasmine'],
    exclude: [],
    client: {
      captureConsole: false
    },

    files: [
      { pattern: './config/spec-bundle.js', watched: false }
    ],

    preprocessors: {
      './config/spec-bundle.js': ['webpack', 'sourcemap']
    },

    webpack: testWebpackConfig,

    coverageReporter: {
      type: 'in-memory'
    },

    webpackMiddleware: {
      noInfo: true,
      stats: {
        chunks: false
      }
    },

    singleRun: true,

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: [
      'Chrome'
    ]
  };

  config.set(configuration);
};
