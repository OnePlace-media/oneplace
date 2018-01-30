const rpc = require('json-rpc2')
const CONSTANTS = require('../constants')
var decoder = require('html-entities').AllHtmlEntities
const config = require('../../../server/config.json')
const clients = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: rpc.Client.$create(80, config.postingWrapper.steemDomain), // api.steemit.com
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: rpc.Client.$create(80, config.postingWrapper.golosDomain) // ws.golos.io | api.golos.cf
}

const cacheMethodsMap = {
  get_accounts: true,
  get_discussions_by_trending: false,
  get_discussions_by_created: false,
  get_discussions_by_hot: false,
  get_content_replies: false,
  get_content: false
}
const cache = {}
function _call(chain, method, params, noCache) {
  if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS && params[0].tag) {
    params[0].select_tags = [params[0].tag]
    delete params[0].tag
  }
  return new Promise((resolve, reject) => {
    if (!clients[chain]) throw new Error(`Unknown chain ${chain}`)
    const cacheKey = [chain, method, JSON.stringify(params)].join(':')
    if (cache[cacheKey] && !noCache) {
      resolve(cache[cacheKey])
    } else {
      clients[chain].call(method, params, {https: false}, (err, result) => {
        if (err) reject(err)
        else {
          if (cacheMethodsMap[method]) {
            cache[cacheKey] = result
          }
          resolve(result)
        }
      })
    }
  })
}
const _avatars_ = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: {},
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: {},
}


const IMG_PREFIX = 'https://steemitimages.com'
const DEFAULT_AVR = '/static/img/avatar.svg'

class BlockChainApi {
  static preparePosts(chain, posts) {
    return Promise.all(
      posts.map(post => {
        return BlockChainApi
          .getAvatar(chain, post.author)
          .then(avatar => {
            const _post = {}
            _post.avatar = avatar
            return _post
          })
      })
    )
  }

  static get PREFIXES() {
    return {
      [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: 'STM',
      [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: 'GLS'
    }
  }

  static getAccount(chain, username, noCache = false) {
    return _call(chain, 'get_accounts', [[username]], noCache)
      .then(accounts => {
        if (!accounts.length) throw new Error('Account not found')
        return accounts[0]
      })
  }

  static getDiscussionsByTrending(chain, params) {
    return _call(chain, 'get_discussions_by_trending', [params])
  }

  static getDiscussionsByCreated(chain, params) {
    return _call(chain, 'get_discussions_by_created', [params])
  }

  static getDiscussionsByHot(chain, params) {
    return _call(chain, 'get_discussions_by_hot', [params])
  }

  static getContent(chain, {author, permlink}) {
    return _call(chain, 'get_content', [author, permlink])
  }

  static getContentReplies(chain, {author, permlink}) {
    return _call(chain, 'get_content_replies', [author, permlink])
  }

  static getProfile(chain, username) {
    return BlockChainApi
      .getAccount(chain, username)
      .then(account => {
        let profile
        if (account && account.json_metadata) {
          profile = JSON.parse(account.json_metadata).profile
        }
        return profile
      })
  }

  static getActiveVotes(chain, {author, permlink}) {
    return _call(chain, 'get_active_votes', [author, permlink])
  }

  static getState(chain, {path}) {
    return _call(chain, 'get_state', [path])
  }

  static getAvatar(chain, username) {
    return new Promise(resolve => {
      if (_avatars_[chain].hasOwnProperty(username)) {
        resolve(_avatars_[chain][username])
      } else {
        BlockChainApi
          .getAccount(chain, username)
          .then(account => {
            if (account && account.json_metadata) {
              _avatars_[chain][username] = JSON.parse(account.json_metadata).profile.profile_image
            }
            if (_avatars_[chain][username]) {
              _avatars_[chain][username] = IMG_PREFIX + '/100x100/' + _avatars_[chain][username]
            }
            resolve(_avatars_[chain][username] || DEFAULT_AVR)
          })
          .catch(e => {
            _avatars_[chain][username] = DEFAULT_AVR
            resolve()
          })
      }
    })
  }
}

module.exports = BlockChainApi