const blockChains = require('@oneplace/blockchains-api')
const chainParser = require('@oneplace/blockchains-api/parser')
const blockChainsHelper = require('@oneplace/blockchains-api/helper')
const CONSTANTS = require('@oneplace/constants')
const moment = require('moment')
const decoder = require('html-entities').AllHtmlEntities
const he = require('he')
const Remarkable = require('remarkable')
const md = new Remarkable

module.exports = Model => {
  Model.trendByTags = async function(chain, tags, exclude = [], cb) {
    const limit = 3
    const results = []
    let excludeIds = [].concat(exclude)
    for (let tag of tags) {
      const options = {
        tag,
        limit: limit + excludeIds.length
      }
      let posts = await Model.app.trendsWatcher.getTrendsByTag(chain, tag, excludeIds)
      excludeIds = excludeIds.concat(posts.map(post => post.id))
      let recentPosts = await Model.app.trendsWatcher.getTrendsByRecent(chain, tag)
      results.push({
        tag,
        posts,
        recentPosts
      })
    }

    return results
  }


  Model.remoteMethod('trendByTags', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'tags', type: 'array', required: true},
      {arg: 'exclude', type: 'array'}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/trendByTags', verb: 'get'}
  })

  Model.byPermLink = async function(chain, username, permlink) {
    let post = await blockChains.getContent(chain, {author: username, permlink})
    post = await Model.app.trendsWatcher.preparePosts(chain, [post], true)
    return post[0]
  }

  Model.remoteMethod('byPermLink', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'permlink', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/byPermLink', verb: 'get'}
  })

  Model.repliesByPermLink = async function(chain, username, permlink) {
    let post = await blockChains.getContent(chain, {author: username, permlink})
    const replies = await Model.app.trendsWatcher.getReplies(chain, post, true)
    return replies
  }

  Model.remoteMethod('repliesByPermLink', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'permlink', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/repliesByPermLink', verb: 'get'}
  })

  Model.getDiscussionsByBlog = async function(chain, tag, start_author, start_permlink, limit) {
    let posts = await blockChains.getDiscussionsByBlog(chain, {tag, start_author, start_permlink, limit})
    if (posts && posts.length)
      posts = await Model.app.trendsWatcher.preparePosts(chain, posts, true)

    return posts || []
  }

  Model.remoteMethod('getDiscussionsByBlog', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'tag', type: 'string', required: true},
      {arg: 'start_author', type: 'string', required: true},
      {arg: 'start_permlink', type: 'string', required: true},
      {arg: 'limit', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getDiscussionsByBlog', verb: 'get'}
  })

  Model.getDiscussionsByAuthorBeforeDate = async function(chain, author, start_permalink, before_date, limit) {
    let posts = await blockChains.getDiscussionsByAuthorBeforeDate(chain, {author, start_permalink, before_date, limit})
    if (posts && posts.length)
      posts = await Model.app.trendsWatcher.preparePosts(chain, posts, true)

    return posts
  }

  Model.remoteMethod('getDiscussionsByAuthorBeforeDate', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'start_permlink', type: 'string', default: ''},
      {arg: 'before_date', type: 'string', required: true},
      {arg: 'limit', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getDiscussionsByAuthorBeforeDate', verb: 'get'}
  })

  const Remarkable = require('remarkable')
  const md = new Remarkable
  Model.comment = async function(req, chain, author, body, parentAuthor, parentPermlink) {
    const accessIsGranted = await Model.app.models.user.checkAccountLink(chain, author, req.accessToken.userId)
    if (!accessIsGranted) {
      const error = new Error('This account not linked with current profile')
      error.status = 401
      throw error
    }
    let result = {}
    try {
      result = await Model.app.postingWrapper.comment(chain, {
        author,
        body,
        parentAuthor,
        parentPermlink
      })
    } catch (error) {
      error = new Error('Bad request, somethign wrong with blockchain request')
      error.status = 400
      throw error
    }
    result.avatar = await blockChains.getAvatar(chain, author)
    const account = await blockChains.getAccount(chain, author)
    result.author_rep = chainParser.convertReputation(account.reputation)
    result.body = md.render(body)
    return result
  }

  Model.remoteMethod('comment', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'chain', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'body', type: 'string', required: true},
      {arg: 'parentAuthor', type: 'string', required: true},
      {arg: 'parentPermlink', type: 'string', required: true},
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/:chain(g|s)/comment', verb: 'post'}
  })

  Model.vote = async function(req, chain, voter, author, permlink, weight) {
    const accessIsGranted = await Model.app.models.user.checkAccountLink(chain, voter, req.accessToken.userId)
    if (!accessIsGranted) {
      const error = new Error('This account not linked with current profile')
      error.status = 401
      throw error
    }

    let result = {}
    try {
      result = await Model.app.postingWrapper.vote(chain, {voter, author, permlink, weight})
    } catch (err) {
      let code = 'UNKNOW_ERROR'
      if (err.data && err.data.stack) {
        if (~err.data.stack[0].format.indexOf('STEEMIT_MIN_VOTE_INTERVAL_SEC')) {
          code = 'STEEMIT_MIN_VOTE_INTERVAL_SEC'
        } else if (~err.data.stack[0].format.indexOf('STEEMIT_MAX_VOTE_CHANGES')) {
          code = 'STEEMIT_MAX_VOTE_CHANGES'
        } else {
          code = err.data.stack[0].format
        }
      }

      const error = new Error('Bad request, somethign wrong with blockchain request')
      error.code = code
      error.status = 400
      throw error
    }

    const account = await blockChains.getAccount(chain, author)
    result.reputation = chainParser.convertReputation(account.reputation)
    return result
  }

  Model.remoteMethod('vote', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'chain', type: 'string', required: true},
      {arg: 'voter', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'permlink', type: 'string', required: true},
      {arg: 'weight', type: 'number', required: true},
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/:chain(g|s)/vote', verb: 'post'}
  })
}
