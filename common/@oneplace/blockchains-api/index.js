const request = require('request')
const CONSTANTS = require('../constants')
var decoder = require('html-entities').AllHtmlEntities
const config = require('../../../server/config.json')

const clientsURL = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: config.postingWrapper.steemDomain,
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: config.postingWrapper.golosDomain
}


const cacheMethodsMap = {
  get_accounts: false,
  get_discussions_by_trending: false,
  get_discussions_by_created: false,
  get_discussions_by_hot: false,
  get_content_replies: false,
  get_content: false
}
const cache = {}
const timeout = process.env.NODE_ENV === 'production' ? 5000 : 10000

function _call(chain, api, method, params, noCache) {
  if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS) {
    if (params[0].tag) {
      params[0].select_tags = [params[0].tag]
      delete params[0].tag
    } else if (params[1] === 'get_discussions_by_blog') {
      params[2][0].select_authors = [params[2][0].tag]
      delete params[2][0].tag
    }
  } else {
    if (api === 'follow') api = 'follow_api'
    else if (api === 'social_network') api = 'database_api'
  }
  return new Promise((resolve, reject) => {
    if (!clientsURL[chain]) throw new Error(`Unknown chain ${chain}`)
    const cacheKey = [chain, method, JSON.stringify(params)].join(':')
    if (cache[cacheKey] && !noCache) {
      resolve(cache[cacheKey])
    } else {
      const json = {
        id: 1,
        method: 'call',
        params: [api, method, params],
        jsonrpc: "2.0"
      }
      request({
        url: `http://${clientsURL[chain]}`,
        method: 'POST',
        timeout,
        json
      }, (err, res, body) => {
        if (err) reject(err)
        else {
          if (cacheMethodsMap[method]) {
            cache[cacheKey] = body.result
          }
          resolve(body.result)
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
    return _call(chain, 'database_api', 'get_accounts', [[username]], noCache)
      .then(accounts => {
        if (!accounts || !accounts.length) throw new Error('Account not found')
        return accounts[0]
      })
  }

  static getDiscussionsByTrending(chain, params) {
    return _call(chain, 'social_network', 'get_discussions_by_trending', [params])
  }

  static getDiscussionsByCreated(chain, params) {
    return _call(chain, 'social_network', 'get_discussions_by_created', [params])
  }

  static getDiscussionsByFeed(chain, params) {
    return _call(chain, 'social_network', 'get_discussions_by_feed', [params])
  }

  static getDiscussionsByHot(chain, params) {
    return _call(chain, 'social_network', 'get_discussions_by_hot', [params])
  }

  static getContent(chain, {author, permlink}) {
    return _call(chain, 'social_network', 'get_content', [author, permlink])
  }

  static getContentReplies(chain, {author, permlink}) {
    return _call(chain, 'social_network', 'get_content_replies', [author, permlink])
  }

  static getProfile(chain, username) {
    return BlockChainApi
      .getAccount(chain, username)
      .then(account => {
        let profile
        if (account && account.json_metadata) {
          try {
            profile = JSON.parse(account.json_metadata).profile
          } catch (e) {
            profile = {}
          }
        }
        return profile
      })
  }

  static getActiveVotes(chain, {author, permlink}) {
    return _call(chain, 'social_network', 'get_active_votes', [author, permlink])
  }

  static getState(chain, {path}) {
    return _call(chain, 'database_api', 'get_state', [path])
  }

  static getFollowCount(chain, {username}) {
    return _call(chain, 'follow', 'get_follow_count', [username])
  }

  static getDiscussionsByAuthorBeforeDate(chain, {author, start_permalink, before_date, limit = 15}) {
    return _call(chain, 'social_network', 'get_discussions_by_author_before_date', [author, start_permalink, before_date, limit])
  }

  static getDiscussionsByBlog(chain, {tag, start_author, start_permlink, limit = 15}) {
    return _call(chain, 'social_network', 'get_discussions_by_blog', [{tag, start_author, start_permlink, limit}])
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
            resolve(_avatars_[chain][username] || CONSTANTS.DEFAULT.AVATAR_IMAGE)
          })
          .catch(e => {
            _avatars_[chain][username] = CONSTANTS.DEFAULT.AVATAR_IMAGE
            resolve()
          })
      }
    })
  }

  static getFollowers(chain, {following, startFollower, followType, limit = 100}) {
    return _call(chain, 'follow', 'get_followers', [following, startFollower, followType, limit])
  }

  static getBlog(chain, {username, entryId = 0, limit = 15}) {
    return _call(chain, 'follow', 'get_blog', [username, entryId, limit])
  }

  static getFeedEntries(chain, {username, start = 0, end = 20}) {
    return _call(chain, 'follow', 'get_feed_entries', [username, start, end])
  }

  
}

module.exports = BlockChainApi