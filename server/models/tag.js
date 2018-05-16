module.exports = Model => {
  var textRegExp = /^(ru--)?[a-zA-Zа-яА-ЯЁё][a-zA-Zа-яА-ЯЁё0-9]+(\-){0,2}[a-zA-Zа-яА-ЯЁё0-9]+$/
  Model.validatesFormatOf('text', {with: textRegExp, message: 'Use only letters, digits and one dash'})

  Model.checkByBlackList = (chain, tags) => {
    const mysql = Model.dataSource.connector
    return new Promise((resolve, reject) => {
      if (tags && tags.length) {
        const sql = 'SELECT COUNT(*) as cnt FROM `tags` WHERE text IN (?) AND chain=? AND inBlackList=1'
        const data = [tags, chain]
        mysql.execute(sql, data, (err, result) => {
          if (err) reject(err)
          else resolve(!!result[0].cnt)
        })
      } else resolve(false)
    })
  }
}