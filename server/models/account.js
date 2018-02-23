const blockChains = require('@oneplace/blockchains-api')
const chainParser = require('@oneplace/blockchains-api/parser')

module.exports = Model => {

  Model.follow = async function(req, chain, follower, following, unfollow) {
    const accessIsGranted = await Model.app.models.user.checkAccountLink(chain, follower, req.accessToken.userId)
    if (!accessIsGranted) {
      const error = new Error('This account not linked with current profile')
      error.status = 401
      throw error
    }

    let result = {}
    try {
      result = await Model.app.postingWrapper.follow(chain, {follower, following, unfollow})
    } catch (err) {
      let code = 'UNKNOW_ERROR'
      const error = new Error('Bad request, somethign wrong with blockchain request')
      error.code = code
      error.status = 400
      throw error
    }

    return result
  }

  Model.remoteMethod('follow', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'chain', type: 'string', required: true},
      {arg: 'follower', type: 'string', required: true},
      {arg: 'following', type: 'string', required: true},
      {arg: 'unfollow', type: 'boolean', default: false}
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/:chain(g|s)/follow', verb: 'post'}
  })
}