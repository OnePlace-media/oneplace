process.env.NODE_ENV = 'test'
const TIME = new Date().getTime()
const async = require('async')
const STORAGE = require('./data/storage')
const exec = require('child_process').exec

const clearDataBases = (mysql, done) => {
  async.waterfall([
    cbAsync => mysql.execute(`SET FOREIGN_KEY_CHECKS = 0;`, err => cbAsync(err)),
    cbAsync => mysql.execute('SHOW TABLES', cbAsync),
    (tables, cbAsync) => {
      async.eachSeries(
        tables,
        (table, cbTable) => mysql.execute(`TRUNCATE TABLE ${table['Tables_in_oneplace']}`, cbTable),
        err => cbAsync(err)
      );
    },
    cbAsync => mysql.execute(`SET FOREIGN_KEY_CHECKS = 1;`, err => cbAsync(err))
  ], err => done(err))
}

describe('API', function() {
  this.timeout(60000)
  before(function(done) {
    STORAGE.app = require('../server')
    STORAGE.app.start()
    STORAGE.app.on('started', () => {
      clearDataBases(STORAGE.app.dataSources.mysql.connector, err => {
        console.log('app ready')
        done(err)
      })
    })
  })

  describe('Modules', function() {
    [
      // 'blockchains-api',
      'usersAndAuth',
      'drafts',
      'imageUpload'
    ].forEach(module => {
      require(`${__dirname}/modules/${module}`)(STORAGE);
    })
  })

  after(function(done) {
    clearDataBases(STORAGE.app.dataSources.mysql.connector, err => {
      STORAGE.app.stop()
      setTimeout(() => {
        done()
        process.exit()
      }, 1000)
    })
  })
})
