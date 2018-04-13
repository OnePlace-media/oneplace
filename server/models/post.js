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

  const Remarkable = require('remarkable')
  const md = new Remarkable

  Model.comment = async function(req, chain, author, body, title, rewardsOpts, tags, parentAuthor, parentPermlink, permlink, upVotePost) {
    const accessIsGranted = await Model.app.models.user.checkAccountLink(chain, author, req.accessToken.userId)
    if (!accessIsGranted) {
      const error = new Error('This account not linked with current profile')
      error.status = 401
      throw error
    }
    let post = await blockChains.getContent(chain, {author, permlink})
    let isUpdate = !!post.id
    let result = {}
    try {
      result = await Model.app.postingWrapper.comment(chain, {
        author,
        body,
        title,
        tags,
        parentAuthor,
        parentPermlink,
        permlink,
        rewardsOpts,
        isUpdate
      })

      if (upVotePost) {
        const vote = await Model.app.postingWrapper.vote(chain, {voter: author, author, permlink: result.permlink, weight: 10000})
      }
    } catch (error) {
      console.log(error)
      let code = 'UNKNOW_ERROR'
      if (error.data && error.data.stack) {
        if (~error.data.stack[0].format.indexOf('STEEMIT_MIN_REPLY_INTERVAL')) {
          code = 'STEEMIT_MIN_REPLY_INTERVAL'
        } else if (~error.data.stack[0].format.indexOf('STEEMIT_MIN_ROOT_COMMENT_INTERVAL')) {
          code = 'STEEMIT_MIN_ROOT_COMMENT_INTERVAL'
        } else {
          code = error.data.stack[0].format
        }
      }

      error = new Error('Bad request, somethign wrong with blockchain request')
      error.code = code
      error.status = 400
      throw error
    }
    const commentRaw = await blockChains.getContent(chain, result)
    const [comment] = await Model.app.trendsWatcher.preparePosts(chain, [commentRaw], true)
    comment.parent_author = parentAuthor
    comment.parent_permlink = parentPermlink
    return comment
  }

  Model.remoteMethod('comment', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'chain', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'body', type: 'string', required: true},
      {arg: 'title', type: 'string'},
      {arg: 'rewardsOpts', type: 'string'},
      {arg: 'tags', type: 'array'},
      {arg: 'parentAuthor', type: 'string'},
      {arg: 'parentPermlink', type: 'string'},
      {arg: 'permlink', type: 'string'},
      {arg: 'upVotePost', type: 'boolean'}
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

  Model.delete_comment = async function(req, chain, author, permlink) {
    const accessIsGranted = await Model.app.models.user.checkAccountLink(chain, author, req.accessToken.userId)
    if (!accessIsGranted) {
      const error = new Error('This account not linked with current profile')
      error.status = 401
      throw error
    }

    let result = {}
    try {
      result = await Model.app.postingWrapper.delete_comment(chain, {author, permlink})
    } catch (err) {
      let code = 'UNKNOW_ERROR'
      if (err.data && err.data.stack) {
        console.log(err.data.stack[0])
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
    return result
  }

  Model.remoteMethod('delete_comment', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'chain', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'permlink', type: 'string', required: true},
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/:chain(g|s)/delete_comment', verb: 'post'}
  })
}
