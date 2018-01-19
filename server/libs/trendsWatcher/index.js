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

const DEFAULT_IMG = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: '/static/img/default-img.jpg',
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: '/static/img/default-img.jpg'
}

const IMG_PREFIX = 'https://steemitimages.com'
const DEFAULT_AVR = '/static/img/avatar.svg'

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
  if (metadata.length == 0) return DEFAULT_IMG[chain]
  let meta = {}
  try {
    meta = JSON.parse(metadata)
  } catch (e) {
    return DEFAULT_IMG[chain]
  }

  if (!meta.image && meta.images) meta.image = meta.images
  return meta.image && meta.image[0] ? chainParser.ipfsPrefix(chain, meta.image[0]) : DEFAULT_IMG[chain]
}

async function getReplies(chain, post) {
  const replies = await blockChains.getContentReplies(chain, {author: post.author, permlink: post.permlink})
  const _replies = []
  for (let replie of replies) {
    const _replie = {}
    _replie.body = chainParser.prepareHTML(chain, replie.body, replie.json_metadata).html
    _replie.author = replie.author
    _replie.author_rep = chainParser.convertReputation(replie.author_reputation)
    _replie.avatar = await blockChains.getAvatar(chain, replie.author)
    _replie.permlink = replie.permlink
    _replie.created = replie.created + '+00:00'
    _replie.payout_declined = parseInt(replie.max_accepted_payout) ? false : true
    _replie.votes = replie.net_votes
    _replie.active_votes = await blockChains.getActiveVotes(chain, replie)
    _replie.children = replie.children
    if (_replie.children) {
      _replie.replies = await getReplies(chain, {author: replie.author, permlink: replie.permlink})
    }
    const payout = parseFloat(replie.pending_payout_value) + parseFloat(replie.total_payout_value) + parseFloat(replie.curator_payout_value)
    _replie.payout = (payout * CURRENCY[chain].q).toFixed(2)

    _replies.push(_replie)
  }
  return _replies
}

async function _preparePosts(chain, posts, full = false) {
  CURRENCY[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].q = await blockChainsHelper.getGoldPrice() / 1000
  const _posts = []
  for (let post of posts) {
    const _post = {}
    _post.id = post.id
    _post.title = post.title
    _post.url = URL_PREFIX[chain] + post.url
    _post.last_payout = post.last_payout + '+00:00'
    _post.created = post.created + '+00:00'
    _post.permlink = post.permlink
    _post.author = post.author
    _post.category = post.parent_permlink
    _post.author_url = URL_PREFIX[chain] + '/@' + post.author
    _post.tags = setTags(chain, post.json_metadata)
    _post.image = setImage(chain, post.json_metadata)
    _post.nsfw = checkTags(_post.tags)
    _post.votes = post.active_votes
    if (full || _post.image === DEFAULT_IMG[chain]) {
      const profile = await blockChains.getProfile(chain, post.author)
      if (profile) {
        _post.author_about = profile.about
      }
      _post.author_rep = chainParser.convertReputation(post.author_reputation)
      const prepareHTML = chainParser.prepareHTML(chain, post.body, post.json_metadata)
      _post.body = prepareHTML.html
      if (_post.image === DEFAULT_IMG[chain] && Array.from(prepareHTML.images).length) {
        _post.image = chainParser.ipfsPrefix(chain, Array.from(prepareHTML.images)[0]) || DEFAULT_IMG[chain]
      }
    }
    const payout = parseFloat(post.pending_payout_value) + parseFloat(post.total_payout_value) + parseFloat(post.curator_payout_value)
    _post.payout = (payout * CURRENCY[chain].q).toFixed(2)
    _post.payout_declined = parseInt(post.max_accepted_payout) ? false : true
    _post.total_payout_value = parseFloat(post.total_payout_value) + parseFloat(post.curator_payout_value)

    _post.children = post.children
    _post.avatar = await blockChains.getAvatar(chain, _post.author)

    _post.preview = ''
    if (post.body) {
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
    this.redis = redis;
    const self = this;
    if (process.env.NODE_ENV && !~['test', 'development'].indexOf(process.env.NODE_ENV)) {
      (function updater() {
        console.log('Start update cache', new Date())
        const restart = err => {
          if (err) console.log(err)
          setTimeout(() => updater(), 60 * 1000)
          console.log('Stop update cache', new Date())
        }

        Promise.all(['s', 'g'].map(chain => new Promise((resolve, reject) => {
          redis.zrangebyscore([KEYS.TOP_TAGS, chain].join(':'), '-inf', '+inf', 'LIMIT', 0, 100, (err, tags) => {
            if (err) reject(err)
            else {
              Promise.all(tags.map(tag => {
                return Promise.all([
                  self.getTrendsByTag(chain, tag, [], true),
                  self.getTrendsByRecent(chain, tag, true)
                ])
              }))
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
}

module.exports = TrendsWatcher