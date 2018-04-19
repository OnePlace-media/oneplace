const blockChains = require('@oneplace/blockchains-api')
const chainParser = require('@oneplace/blockchains-api/parser')
const CONSTANTS = require('@oneplace/constants')

module.exports = Model => {

  // ----- GET BLOG BY USERNAME -----
  Model.remoteMethod('getBlog', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getBlog', verb: 'get'}
  })

  Model.getBlog = async function(chain, username) {
    let blog = await blockChains.getBlog(chain, {username})
    let posts = []
    if (blog) {
      for (item of blog) {
        const post = await blockChains.getContent(chain, {author: item.comment.author, permlink: item.comment.permlink})
        posts.push(post)
      }
    }

    posts = await Model.app.trendsWatcher.preparePosts(chain, posts, true)
    return posts || []
  }

  // ----- GET ACCOUNT BY USERNAME -----
  Model.remoteMethod('getAccount', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true}
    ],
    returns: {arg: 'body', type: 'object', root: true},
    http: {path: '/:chain(g|s)/getAccount', verb: 'get'}
  })

  Model.getAccount = async function(chain, username) {
    let account = await blockChains.getAccount(chain, username)
    if (account) {
      account.reputation = chainParser.convertReputation(account.reputation)
      account.followCount = await blockChains.getFollowCount(chain, {username})
      if (account.json_metadata) {
        try {
          account.meta = JSON.parse(account.json_metadata)
        } catch (err) {
          account.meta = {}
        }
      }
    }
    return account || {}
  }

  // ----- GET DISCUSSIONS BY AUTHOR BEFORE DATE -----

  Model.remoteMethod('getDiscussionsByAuthorBeforeDate', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'start_permlink', type: 'string', required: false},
      {arg: 'before_date', type: 'string', required: false},
      {arg: 'limit', type: 'string', default: 10}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getDiscussionsByAuthorBeforeDate', verb: 'get'}
  })

  Model.getDiscussionsByAuthorBeforeDate = async function(chain, author, start_permlink, before_date, limit) {
    if (!before_date) before_date = new Date().toISOString().split('.')[0]
    let posts = await blockChains.getDiscussionsByAuthorBeforeDate(chain, {author, start_permlink, before_date, limit})
    if (posts && posts.length)
      posts = await Model.app.trendsWatcher.preparePosts(chain, posts, true)
    return posts || []
  }

  // ----- GET DISCUSSIONS BY CREATED -----

  Model.remoteMethod('getDiscussionsByCreated', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'author', type: 'string', required: true},
      {arg: 'start_permlink', type: 'string', required: false},
      {arg: 'limit', type: 'string', default: 10}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getDiscussionsByCreated', verb: 'get'}
  })

  Model.getDiscussionsByCreated = async function(chain, author, start_permlink = '', limit = 10) {
    const params = {
      limit
    }
    if (start_permlink) {
      params.start_permlink = start_permlink
      params.start_author = author
    }
    if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS)
      params.select_authors = [author]
    else
      params.tag = author

    let posts = await blockChains.getDiscussionsByCreated(chain, params)
    if (posts && posts.length)
      posts = await Model.app.trendsWatcher.preparePosts(chain, posts, true)
    return posts || []
  }

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
            try {
              state.accounts[username].meta = JSON.parse(state.accounts[username].json_metadata)
            } catch (err) {
              state.accounts[username].meta = {}
            }
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
    if (post.id) {
      post = await Model.app.trendsWatcher.preparePosts(chain, [post], true)
      return post[0]
    } else {
      error = new Error('Not found')
      error.code = 'NOT_FOUND'
      error.status = 404
      throw error
    }
  }

  // ----- GET FEED -----
  Model.remoteMethod('getFeed', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'start', type: 'number', required: true},
      {arg: 'end', type: 'number', required: true}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getFeed', verb: 'get'}
  })

  Model.getFeed = async function(chain, username, start, end) {
    const posts = []
    const enteries = await blockChains.getFeedEntries(chain, {username, start, end})
    if (enteries.length) {
      for (item of enteries) {
        const postRaw = await blockChains.getContent(chain, item)
        let [post] = await Model.app.trendsWatcher.preparePosts(chain, [postRaw], true)
        if (item.reblog_by.length) {
          item.reblog_avatars = []
          for (user of item.reblog_by) {
            const avatar = await blockChains.getAvatar(chain, user)
            item.reblog_avatars.push(avatar)
          }
        }
        posts.push(Object.assign(post, item))
      }
    }
    return posts
  }

   // ----- GET DISCUSSIONS BY FEED -----

   Model.remoteMethod('getDiscussionsByFeed', {
    accepts: [
      {arg: 'chain', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'start_author', type: 'string', required: true},
      {arg: 'start_permlink', type: 'string', required: true},
      {arg: 'limit', type: 'string', default: 10}
    ],
    returns: {arg: 'body', type: 'array', root: true},
    http: {path: '/:chain(g|s)/getDiscussionsByFeed', verb: 'get'}
  })

  Model.getDiscussionsByFeed = async function(chain, username, start_author, start_permlink, limit) {
    const params = {
      start_author,
      start_permlink,
      limit
    }

    if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS)
      params.select_authors = [username]
    else
      params.tag = username

    let posts = await blockChains.getDiscussionsByFeed(chain, params)
    if (posts && posts.length)
      posts = await Model.app.trendsWatcher.preparePosts(chain, posts, true)
    return posts || []
  }
  Model.getDiscussionsByFeed
}