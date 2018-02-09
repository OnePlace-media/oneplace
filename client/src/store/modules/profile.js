import Api from '../../plugins/api'
const TYPES = {
  SET_ACCOUNT_DATA: 'SET_ACCOUNT_DATA',
  SET_ACCOUNT_PROCESSING: 'SET_ACCOUNT_PROCESSING',

  SET_POSTS_PROCESSING: 'SET_POSTS_PROCESSING',
  SET_POSTS_DATA: 'SET_POSTS_DATA',
  APPEND_POSTS_DATA: 'APPEND_POSTS_DATA',

  SET_FOLLOWERS_BY_CURRENT_ACCOUNTS_PROCESSING: 'SET_FOLLOWERS_BY_CURRENT_ACCOUNTS_PROCESSING',
  SET_FOLLOWERS_BY_CURRENT_ACCOUNTS: 'SET_FOLLOWERS_BY_CURRENT_ACCOUNTS',

  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
}


export default () => {
  const state = {
    account: {
      processing: true,
      data: {}
    },
    posts: {
      processing: true,
      collection: []
    },
    followers: {
      byCurrentAccounts: {
        processing: false,
        collection: []
      }
    },
  }

  const mutations = {
    [TYPES.SET_ACCOUNT_PROCESSING](state, flag) {
      state.account.processing = flag
    },
    [TYPES.SET_ACCOUNT_DATA](state, {data}) {
      state.account.data = data
    },

    [TYPES.SET_POSTS_PROCESSING](state, flag) {
      state.posts.processing = flag
    },
    [TYPES.APPEND_POSTS_DATA](state, {posts}) {
      state.posts.collection = [...state.posts.collection, ...posts]
    },
    [TYPES.SET_POSTS_DATA](state, {posts}) {
      state.posts.collection = posts
    },

    [TYPES.SET_FOLLOWERS_BY_CURRENT_ACCOUNTS_PROCESSING](state, flag) {
      state.followers.byCurrentAccounts.processing = flag
    },
    [TYPES.SET_FOLLOWERS_BY_CURRENT_ACCOUNTS](state, collection) {
      state.followers.byCurrentAccounts.collection = collection
    },

    [TYPES.CLEAR_ALL_DATA](state) {
      state.account.data = {}
      state.posts.collection = []
      state.followers.byCurrentAccounts.collection = []
    }
  }

  const actions = {
    fetchAccount({commit}, {chain, username}) {
      commit(TYPES.SET_ACCOUNT_PROCESSING, true)
      return Api.getAccountByName(chain, username)
        .then(response => {
          commit(TYPES.SET_ACCOUNT_DATA, {data: response.data})
          commit(TYPES.SET_ACCOUNT_PROCESSING, false)
        })
    },
    fetchPostByAuthor({commit, state}, {chain, author, before_date, limit}) {
      commit(TYPES.SET_POSTS_PROCESSING, true)
      return Api.getDiscussionsByAuthorBeforeDate(chain, {author, before_date, limit})
        .then(response => {
          if (state.account.data.name === author) {
            commit(TYPES.SET_POSTS_DATA, {posts: response.data})
            commit(TYPES.SET_POSTS_PROCESSING, false)
          }
        })
    },
    appendPostByAuthor({commit, state}, {chain, tag, start_author, start_permlink, limit}) {
      commit(TYPES.SET_POSTS_PROCESSING, true)
      return Api.getDiscussionsByBlog(chain, {tag, start_author, start_permlink, limit})
        .then(response => {
          if (state.account.data.name === start_author) {
            response.data.shift()
            commit(TYPES.APPEND_POSTS_DATA, {posts: response.data})
            commit(TYPES.SET_POSTS_PROCESSING, false)
          }
          return response.data
        })
    },
    follow({commit, state}, {chain, follower, following, unfollow}) {
      return Api
        .follow(chain, follower, following, unfollow)
        .then(() => {
          let collection = [...state.followers.byCurrentAccounts.collection]

          if (unfollow)
            collection = collection.filter(item => item.follower !== follower)
          else
            collection.push({follower, following, what: ['blog']})

          commit(TYPES.SET_FOLLOWERS_BY_CURRENT_ACCOUNTS, collection)
        })
    },
    fetchFollowersByCurrentAccounts({commit, state}, {chain, accounts, following}) {
      commit(TYPES.SET_FOLLOWERS_BY_CURRENT_ACCOUNTS_PROCESSING, true)
      const followType = 'blog'
      return Promise
        .all(accounts.map(account => {
          const startFollower = account.data.name
          return Api.getFollowers(chain, {following, startFollower, followType, limit: 1})
        }))
        .then(results => {
          const collection = results.map(response => response.data.length ? response.data[0] : null).filter(acc => acc)
          commit(TYPES.SET_FOLLOWERS_BY_CURRENT_ACCOUNTS, collection)
          commit(TYPES.SET_FOLLOWERS_BY_CURRENT_ACCOUNTS_PROCESSING, false)
        })
    }
  }

  return {
    namespaced: true,
    state,
    actions,
    mutations
  }
}