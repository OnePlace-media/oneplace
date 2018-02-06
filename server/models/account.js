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
}