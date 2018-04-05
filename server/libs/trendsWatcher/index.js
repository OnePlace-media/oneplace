const blockChains = require('@oneplace/blockchains-api')
const chainParser = require('@oneplace/blockchains-api/parser')
const blockChainsHelper = require('@oneplace/blockchains-api/helper')
const CONSTANTS = require('@oneplace/constants')
const moment = require('moment')
const decoder = require('html-entities').AllHtmlEntities
const he = require('he')
const Remarkable = require('remarkable')
const md = new Remarkable

const URL_PREFIX = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: 'https://steemit.com',
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: 'https://golos.io'
}

const CURRENCY = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: {
    symbol: '$',
    q: 1
  },
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: {
    symbol: '₽',
    q: 1
  }
}

const PREVIEW_LENGTH = 130

const stubFn = err => {
  if (err) console.log(err)
}
const limit = 3
const STORAGE_LIMIT = 30
const KEYS = {
  TOP_TAGS: 'tags:top',
  TRENDS_BY_TAG_CACHE: 'trends:by:tag:cache',
  RECENT_BY_TAG_CACHE: 'recent:by:tag:cache'
}

function setTags(chain, metadata) {
  if (metadata.length == 0) return false
  let meta = {}
  try {
    meta = JSON.parse(metadata)
  } catch (e) {
    return false
  }
  return meta.tags || []
}

function checkTags(tags) {
  if (!tags) return false
  if (~tags.indexOf("18+")) return '18+'
  if (~tags.indexOf("ru--mat")) return 'мат'
  if (~tags.indexOf("nsfw")) return 'nsfw'
  return false
}

function setImage(chain, metadata) {
  if (metadata.length == 0) return CONSTANTS.DEFAULT.POST_IMAGE
  let meta = {}
  try {
    meta = JSON.parse(metadata)
  } catch (e) {
    return CONSTANTS.DEFAULT.POST_IMAGE
  }

  if (!meta.image && meta.images) meta.image = meta.images
  return meta.image && meta.image[0] ? chainParser.proxyImagePrefix(chain, meta.image[0]) : CONSTANTS.DEFAULT.POST_IMAGE
}

async function getReplies(chain, post) {
  const replies = await blockChains.getContentReplies(chain, {author: post.author, permlink: post.permlink})
  const _replies = await _preparePosts(chain, replies, true, true)
  for (let replie of _replies) {
    replie.parent_permlink = post.permlink
    replie.parent_author = post.author
    if (replie.children) {
      replie.replies = await getReplies(chain, {author: replie.author, permlink: replie.permlink})
    }
  }
  return _replies
}

async function _preparePosts(chain, posts, full = false, replie = false) {
  CURRENCY[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].q = await blockChainsHelper.getGoldPrice() / 1000
  const _posts = []
  if (posts && posts.length) {
    for (let post of posts) {
      const _post = {}
      _post.id = post.id
      if (post.first_reblogged_on) {
        _post.first_reblogged_on = post.first_reblogged_on + '+00:00'
      }
      _post.cashout_time = post.cashout_time + '+00:00'
      _post.percent_steem_dollars = post.percent_steem_dollars
      _post.title = post.title
      _post.last_payout = post.last_payout + '+00:00'
      _post.created = post.created + '+00:00'
      _post.vote_rshares = post.vote_rshares
      _post.net_rshares = post.net_rshares
      _post.body_orig = post.body
      _post.net_votes = post.net_votes
      _post.permlink = post.permlink
      _post.author = post.author
      _post.category = post.parent_permlink
      _post.author_url = URL_PREFIX[chain] + '/@' + post.author
      _post.tags = setTags(chain, post.json_metadata)
      _post.image = setImage(chain, post.json_metadata)
      _post.nsfw = checkTags(_post.tags)
      _post.mode = post.mode
      if (replie) {
        _post.active_votes = await blockChains.getActiveVotes(chain, post)
      } else {
        _post.active_votes = post.active_votes
      }

      if (full || _post.image === CONSTANTS.DEFAULT.POST_IMAGE) {
        const profile = await blockChains.getProfile(chain, post.author)
        if (profile) {
          _post.author_about = profile.about
        }
        _post.author_rep = chainParser.convertReputation(post.author_reputation)
        const prepareHTML = chainParser.prepareHTML(chain, post.body, post.json_metadata)
        _post.body = prepareHTML.html

        if (_post.image === CONSTANTS.DEFAULT.POST_IMAGE && prepareHTML.state && prepareHTML.state.images && Array.from(prepareHTML.state.images).length) {
          _post.image = chainParser.ipfsPrefix(chain, Array.from(prepareHTML.state.images)[0]) || CONSTANTS.DEFAULT.POST_IMAGE
        }
      }

      if (full && chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS && post.mode === CONSTANTS.BLOCKCHAIN.MODES.ARCHIVED) {
        // const stateData = await blockChains.getState(chain, {path: `@${post.author}/transfers`})
        _post.separatePayots = {}
        // _post.separatePayots = stateData
        //   .accounts[post.author]
        //   .transfer_history
        //   .filter(item => item[1].op[0] === 'author_reward' && item[1].op[1].permlink === post.permlink)
        //   .reduce((obj, item) => {
        //     let mode = CONSTANTS.BLOCKCHAIN.MODES.FIRST_PAYOUT
        //     if (moment(item[1].timestamp + '+00:00').unix() > moment(_post.created).subtract(-30, 'days').unix()) {
        //       mode = CONSTANTS.BLOCKCHAIN.MODES.SECOND_PAYOUT
        //     }
        //     obj[mode] = item[1].op[1]
        //     return obj
        //   }, {})
      }

      const payout = parseFloat(post.pending_payout_value) + parseFloat(post.total_payout_value) + parseFloat(post.curator_payout_value)
      _post.payout = (payout * CURRENCY[chain].q).toFixed(2)
      _post.pending_payout = (parseFloat(post.pending_payout_value) * CURRENCY[chain].q).toFixed(2)
      _post.pending_payout_value = parseFloat(post.pending_payout_value)

      _post.payout_declined = parseInt(post.max_accepted_payout) ? false : true
      _post.total_payout_value = parseFloat(post.total_payout_value) + parseFloat(post.curator_payout_value)
      _post.total_payout = (_post.total_payout_value * CURRENCY[chain].q).toFixed(2)
      _post.children = post.children
      _post.avatar = await blockChains.getAvatar(chain, _post.author)

      _post.preview = ''
      if (post.body && !replie) {
        let preview = post.body.replace(/<[^>]+>/gm, '')
        preview = decoder.decode(md.render(preview)).replace(/<[^>]+>/gm, '')
        preview = he.decode(preview)
        preview = chainParser.cutLinks(preview, PREVIEW_LENGTH).substring(0, PREVIEW_LENGTH)
        _post.preview = preview.length == PREVIEW_LENGTH
          ? preview.substring(0, preview.split('').lastIndexOf(' ')) + '...'
          : preview
      }
      _posts.push(_post)
    }
  }

  return _posts
}

async function loadPosts(method, chain, tag, _limit) {
  const options = {
    tag,
    limit: _limit
  }
  let posts = await blockChains[method](chain, options)
  posts = await _preparePosts(chain, posts)
  return posts
}

class TrendsWatcher {
  constructor(redis) {
    this.redis = redis
  }

  async preparePosts(chain, posts, full = false) {
    return await _preparePosts(chain, posts, full)
  }

  getFromCache(cacheKey, _limit) {
    return new Promise((resolve, reject) => {
      this.redis.lrange(cacheKey, 0, _limit, (err, records) => {
        if (err) reject(err)
        else resolve(records)
      })
    })
  }

  async getTrendsByTag(chain, tag, exclude = [], reCache = false) {
    this.redis.zincrby([KEYS.TOP_TAGS, chain].join(':'), -1, tag, stubFn)
    const cacheKey = [KEYS.TRENDS_BY_TAG_CACHE, chain, tag].join(':')
    let posts = await this.getFromCache(cacheKey, limit + exclude.length)
    if (!posts.length || reCache) {
      posts = await loadPosts('getDiscussionsByTrending', chain, tag, STORAGE_LIMIT)
      if (posts.length < STORAGE_LIMIT) {
        let hotPosts = await loadPosts('getDiscussionsByHot', chain, tag, STORAGE_LIMIT - posts.length)
        hotPosts = hotPosts.filter(post => {
          return !~exclude.indexOf(post.id) && !~posts.findIndex(_post => _post.id === post.id)
        }).slice(0, limit - posts.length)
        posts = posts.concat(hotPosts)
      }

      const multi = this.redis.multi()
      multi.del(cacheKey)
      posts.forEach(post => {
        multi.rpush(cacheKey, JSON.stringify(post))
        multi.expire(cacheKey, 60 * 60)
      })
      await multi.exec()
    } else {
      posts = posts.map(post => JSON.parse(post))
    }
    return posts.filter(post => !~exclude.indexOf(post.id)).slice(0, limit)
  }

  async getTrendsByRecent(chain, tag, reCache = false) {
    this.redis.zincrby(KEYS.TOP_TAGS, 1, tag, stubFn)
    const cacheKey = [KEYS.RECENT_BY_TAG_CACHE, chain, tag].join(':')
    let posts = await this.getFromCache(cacheKey, 6)
    if (!posts.length || reCache) {
      posts = await loadPosts('getDiscussionsByCreated', chain, tag, 6)
      const multi = this.redis.multi()
      multi.del(cacheKey)
      posts.forEach(post => {
        multi.rpush(cacheKey, JSON.stringify(post))
      })
      multi.expire(cacheKey, 60 * 60)
      await multi.exec()
    } else {
      posts = posts.map(post => JSON.parse(post))
    }
    return posts.slice(0, 6)
  }

  async getReplies(chain, post) {
    return getReplies(chain, post)
  }

  startCacheUpdater() {
    const self = this
    if (process.env.NODE_ENV && !~['test', 'development'].indexOf(process.env.NODE_ENV)) {
      (function updater() {
        console.log('Start update cache', new Date())
        const restart = err => {
          if (err) console.log(err)
          setTimeout(() => updater(), 2 * 60 * 1000)
          console.log('Stop update cache', new Date())
        }

        Promise.all(['s', 'g'].map(chain => new Promise((resolve, reject) => {
          self.redis.zrangebyscore([KEYS.TOP_TAGS, chain].join(':'), '-inf', '+inf', 'LIMIT', 0, 100, (err, tags) => {
            if (err) reject(err)
            else {
              const chainOfPromises = tags.reduce((p, tag) => {
                return p.then(() => Promise.all([
                  self.getTrendsByTag(chain, tag, [], true),
                  self.getTrendsByRecent(chain, tag, true)
                ]))
              }, Promise.resolve())

              chainOfPromises
                .then(() => {
                  resolve()
                })
                .catch(err => {
                  console.error(err)
                  resolve()
                })
            }
          })
        })))
          .then(() => {
            restart()
          })
          .catch(err => restart(err))
      })()
    }
  }
}

module.exports = TrendsWatcher