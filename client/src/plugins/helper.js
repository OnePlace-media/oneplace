import Vue from 'vue'
export default class Helper {
  static install() {
    Vue.prototype.$helper = new Helper()
  }

  handleValidationError(errorsFromResponse, errors) {
    const codes = errorsFromResponse.details.codes
    const messages = errorsFromResponse.details.messages
    Object.keys(codes).forEach(field => {
      codes[field].forEach((rule, index) => {
        errors.add({
          field,
          rule,
          scope: rule,
          id: [field, rule].join(),
          msg: messages[field][index]
        })
      })
    })
  }
}
