import Api from '../../plugins/api'
const TYPES = {
  SET_ACCOUNT_DATA: 'SET_ACCOUNT_DATA',
  SET_ACCOUNT_PROCESSING: 'SET_ACCOUNT_PROCESSING',
  SET_POSTS_PROCESSING: 'SET_POSTS_PROCESSING',
  SET_POSTS_DATA: 'SET_POSTS_DATA',
  APPEND_POSTS_DATA: 'APPEND_POSTS_DATA',
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
    }
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
    [TYPES.CLEAR_ALL_DATA](state) {
      state.account.data = {}
      state.posts.collection = []
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
    }
  }

  return {
    namespaced: true,
    state,
    actions,
    mutations
  }
}