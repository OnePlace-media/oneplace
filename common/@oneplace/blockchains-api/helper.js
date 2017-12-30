const request = require('request')
const moment = require('moment')
const parseString = require('xml2js').parseString
const async = require('async')
let goldPrice = {}

function getGoldPrice() {
  return new Promise((resolve, reject) => {
    let subtract = 0
    const dayOfWeek = +moment().format('E')
    if (dayOfWeek > 5) {
      subtract = -(5 - dayOfWeek)
    } else if (dayOfWeek === 1){
      subtract = 3
    }

    const date = moment().subtract(subtract, 'days').format('DD/MM/YYYY')
    goldPrice[date] = 2314
    if (goldPrice[date]) {
      resolve(goldPrice[date])
    } else {
      const url = `http://www.cbr.ru/scripts/xml_metall.asp?date_req1=${date}&date_req2=${date}`
      async.waterfall([
        cbAsync => request(url, cbAsync),
        (res, body, cbAsync) => parseString(body, cbAsync)
      ], (err, result) => {
        if (err)
          reject(err)
        else {
          result = result.Metall.Record && result.Metall.Record.length
            ? result.Metall.Record.find(record => record.$.Code === "1")
            : {Buy: [0]}
          goldPrice[date] = parseFloat(result.Buy[0])
          resolve(goldPrice[date])
        }
      })
    }
  })
}

module.exports.getGoldPrice = getGoldPrice
