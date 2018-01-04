const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const config = require('../../server/config.json')
const isProd = process.env.NODE_ENV === 'production'
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: {
    app: './client/src/entry-client.js'
  },
  target: 'web',
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('../node_modules'),
      resolve('../common')
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'containers': resolve('src/containers')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: isProd
          ? ExtractTextPlugin.extract({
            use: 'css-loader?minimize',
            fallback: 'vue-style-loader'
          })
          : ['vue-style-loader', 'css-loader']
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.STEEM_DOMAIN': `"${config.postingWrapper.steemDomain}"`,  // api.steemit.com'
      'process.env.GOLOS_DOMAIN': `"${config.postingWrapper.golosDomain}"`, // 'wss://ws.golos.io' //api.golos.cf'
      'process.env.APPLICATION_USERNAME': `"${config.postingWrapper.username}"`,
      'process.env.BASE_API_URL': `"${process.env.NODE_ENV === 'production' ? '/api/' : 'http://127.0.0.1:3001/api/'}"`
    }),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /en|ru/
    )
  ].concat(
    isProd
      ? [
        new UglifyJsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
      : [new FriendlyErrorsPlugin()]
    )
}