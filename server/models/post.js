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
  Model.comment = async function(req, chain, author, body, parentAuthor, parentPermlink, permlink) {
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
        parentPermlink,
        permlink
      })
    } catch (error) {
      console.log(error)
      error = new Error('Bad request, somethign wrong with blockchain request')
      error.status = 400
      throw error
    }
    let comment = await blockChains.getContent(chain, result)
    comment = await Model.app.trendsWatcher.preparePosts(chain, [comment], true)
    return comment[0]
  }

  Model.remoteMethod('comment', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'chain', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'body', type: 'string', required: true},
      {arg: 'parentAuthor', type: 'string', required: true},
      {arg: 'parentPermlink', type: 'string', required: true},
      {arg: 'permlink', type: 'string'},
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
