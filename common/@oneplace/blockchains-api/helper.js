const request = require('request')
const moment = require('moment')
const parseString = require('xml2js').parseString
const async = require('async')
let goldPrice = {}

function getGoldPrice() {
  return new Promise((resolve, reject) => {
    const date_req1 = moment().subtract(7, 'days').format('DD/MM/YYYY')
    const date_req2 = moment().format('DD/MM/YYYY')
    if (goldPrice[date_req2]) {
      resolve(goldPrice[date_req2])
    } else {
      const url = `http://www.cbr.ru/scripts/xml_metall.asp?date_req1=${date_req1}&date_req2=${date_req2}`
      async.waterfall([
        cbAsync => request({url, headers:{'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'}}, cbAsync),
        (res, body, cbAsync) => parseString(body, cbAsync)
      ], (err, result) => {
        if (err) {
          resolve(2400)
        } else {
          if (result.Metall && result.Metall.Record && result.Metall.Record.length) {
            const prices = result.Metall.Record.filter(record => record.$.Code === "1")
            result = prices[prices.length - 1]
            goldPrice[date_req2] = parseFloat(result.Buy[0])
          } else {
            result = {Buy: [0]}
          }
          resolve(goldPrice[date_req2])
        }
      })
    }
  })
}

module.exports.getGoldPrice = getGoldPrice
