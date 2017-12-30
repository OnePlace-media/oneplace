module.exports = {
  request: function(req, token) {
    this.options.http._setHeaders.call(this, req, {Authorization: token})
  },
  response: function(res) {
    return ~res.request.responseURL.indexOf('users/login') ? res.data.id : null
  }
}
