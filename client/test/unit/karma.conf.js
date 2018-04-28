const baseConfig = require('../../build/webpack.base.config')
const webpack = require('webpack')
const webpackConfig = Object.assign({}, baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"test"'
    })
  ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    reporters: [
      'spec', 
    //  'coverage'
    ],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      instrumenterOptions: {
        istanbul: {noCompact: true}
      },
      dir: './coverage',
      reporters: [
        {type: 'text'},
        {type: 'lcov', subdir: '.'},
        {type: 'text-summary'}
      ]
    }
  })
}