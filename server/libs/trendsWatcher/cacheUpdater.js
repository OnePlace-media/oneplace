const config = require('../../config.json')
const redis = require('redis').createClient(config.redis)
const TrendsWatcher = require('./index')
const watcher = new TrendsWatcher(redis)

watcher.startCacheUpdater()