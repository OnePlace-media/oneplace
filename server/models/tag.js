module.exports = Model => {
  var textRegExp = /^(ru--)?[a-zA-Zа-яА-ЯЁё][a-zA-Zа-яА-ЯЁё0-9]+(\-){0,2}[a-zA-Zа-яА-ЯЁё0-9]+$/
  Model.validatesFormatOf('text', {with: textRegExp, message: 'Use only letters, digits and one dash'})
}