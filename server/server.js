'use strict';
process.setMaxListeners(0);
const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();

app.stop = function() {
  app.redis.quit()
  app.dataSources.redis.client.quit()
  // app.dataSources.mysql.connector.close()
  app.server.close()
}

app.start = function() {
  const redis = require('redis')
  const bluebird = require('bluebird')
  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)
  app.redis = redis.createClient(app.get('redis'))

  const TrendsWatcher = require('./libs/trendsWatcher')
  app.trendsWatcher = new TrendsWatcher(app.redis)

  const PostingWrapper = require('./libs/postingWrapper')
  app.postingWrapper = new PostingWrapper(app.get('postingWrapper'))

  // start the web server

  app.server = app.listen(function() {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  })

  return app.server
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // Object.keys(app.models).forEach(modelName => {
  //   if (app.models[modelName].appInit) {
  //     app.models[modelName].appInit();
  //   }
  // });

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start()
  }
})
