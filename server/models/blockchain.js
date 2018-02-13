const blockChains = require('@oneplace/blockchains-api')
const chainParser = require('@oneplace/blockchains-api/parser')

module.exports = Model => {

  // ----- GET DISCUSSIONS BY BLOG -----
  
  Model.remoteMethod('getDiscussionsByBlog', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'tag', type: 'string', required: true},
      {arg: 'start_author', type: 'string', required: true},
      {arg: 'start_permlink', type: 'string', required: true},
      {arg: 'limit', type: 'string', default: 10}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getDiscussionsByBlog', verb: 'get'}
  })

  Model.getDiscussionsByBlog = async function(chain, tag, start_author, start_permlink, limit) {
    let posts = await blockChains.getDiscussionsByBlog(chain, {tag, start_author, start_permlink, limit})
    if (posts && posts.length)
      posts = await Model.app.trendsWatcher.preparePosts(chain, posts, true)
    return posts || []
  }

  // ----- REPLIES BY PERMLINK -----

  Model.remoteMethod('repliesByPermLink', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'permlink', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/repliesByPermLink', verb: 'get'}
  })

  Model.repliesByPermLink = async function(chain, username, permlink) {
    const post = await blockChains.getContent(chain, {author: username, permlink})
    const replies = await Model.app.trendsWatcher.getReplies(chain, post, true)
    return replies
  }

  // ----- GET STATE -----

  Model.remoteMethod('getState', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'path', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/:chain(g|s)/getState', verb: 'get'}
  })

  Model.getState = async function(chain, path) {
    const state = await blockChains.getState(chain, {path})
    if (state) {
      if (state.accounts) {
        for (let username in state.accounts) {
          state.accounts[username].reputation = chainParser.convertReputation(state.accounts[username].reputation)
          state.accounts[username].followCount = await blockChains.getFollowCount(chain, {username})
          if (state.accounts[username].json_metadata)
            state.accounts[username].meta = JSON.parse(state.accounts[username].json_metadata)
        }
      }

      if (state.content) {
        for (let post in state.content) {
          const posts = await Model.app.trendsWatcher.preparePosts(chain, [state.content[post]], true)
          state.content[post] = posts[0]
        }
      }
    }

    return state || {}
  }

  // ----- GET FOLLOWERS -----

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


  // ----- GET CONTENT -----

  Model.remoteMethod('getContent', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'permlink', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getContent', verb: 'get'}
  })

  Model.getContent = async function(chain, username, permlink) {
    let post = await blockChains.getContent(chain, {author: username, permlink})
    post = await Model.app.trendsWatcher.preparePosts(chain, [post], true)
    return post[0]
  }
}