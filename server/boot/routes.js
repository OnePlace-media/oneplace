const blockChainsHelper = require('@oneplace/blockchains-api/helper')
module.exports = (app) => {
  const request = require('request')
  app.get('/api/img', (req, res) => {
    request(req.query.l).pipe(res)
  })

  app.get('/api/params', async (req, res) => {
    const goldPrice = await blockChainsHelper.getGoldPrice() / 1000
    const params = {
      goldPrice
    }
    res.json(params)
    res.end()
  })
}