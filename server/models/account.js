const blockChains = require('@oneplace/blockchains-api')
const chainParser = require('@oneplace/blockchains-api/parser')

module.exports = Model => {
  Model.byName = async function(chain, username) {
    const account = await blockChains.getAccount(chain, username, true)
    account.reputation = chainParser.convertReputation(account.reputation)
    if (account.json_metadata)
      account.meta = JSON.parse(account.json_metadata)

    account.followCount = await blockChains.getFollowCount(chain, {username})
    return account
  }

  Model.remoteMethod('byName', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/:chain(g|s)/byName', verb: 'get'}
  })

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

  Model.getFollowers = async (chain, following, startFollower, followType, limit) => {
    return blockChains.getFollowers(chain, {following, startFollower, followType, limit})
  }

  Model.remoteMethod('getFollowers', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'following', type: 'string', required: true},
      {arg: 'startFollower', type: 'string', required: true},
      {arg: 'followType', type: 'string', required: true},
      {arg: 'limit', type: 'number', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getFollowers', verb: 'get'}
  })
}