module.exports = (app) => {
  const request = require('request')
  app.get('/api/img', (req, res) => {
    request(req.query.l).pipe(res)
  })
}