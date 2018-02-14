import Api from '../../plugins/api'
import moment from 'moment'

const TYPES = {
  SET_CHAIN: 'SET_CHAIN',
  SET_ACCOUNT_DATA: 'SET_ACCOUNT_DATA',
  SET_ACCOUNT_PROCESSING: 'SET_ACCOUNT_PROCESSING',
  SET_ACCOUNT_FOLLOW_PROCESSING: 'SET_ACCOUNT_FOLLOW_PROCESSING',

  SET_POSTS_PROCESSING: 'SET_POSTS_PROCESSING',
  SET_POSTS_DATA: 'SET_POSTS_DATA',
  APPEND_POSTS_DATA: 'APPEND_POSTS_DATA',

  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
}


export default () => {
  const state = {
    chain: null,
    account: {
      processing: true,
      followProcessing: false,
      data: {}
    },
    posts: {
      processing: true,
      collection: []
    }
  }

  const mutations = {
    [TYPES.SET_CHAIN](state, chain) {
      state.chain = chain
    },
    [TYPES.SET_ACCOUNT_PROCESSING](state, flag) {
      state.account.processing = flag
    },
    [TYPES.SET_ACCOUNT_DATA](state, {data}) {
      state.account.data = data
    },
    [TYPES.SET_ACCOUNT_FOLLOW_PROCESSING](state, flag) {
      state.account.followProcessing = flag
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
      state.chain = null
      state.account.data = {}
      state.posts.collection = []
    }
  }

  const actions = {
    fetchState({commit}, {chain, username}) {
      commit(TYPES.SET_ACCOUNT_PROCESSING, true)
      return Api.getState(chain, {path: `@${username}`})
        .then(response => {
          const posts = Object.keys(response.data.content).map(link => response.data.content[link])
          posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
          commit(TYPES.SET_CHAIN, chain)
          commit(TYPES.SET_ACCOUNT_DATA, {data: response.data.accounts[username]})
          commit(TYPES.SET_POSTS_DATA, {posts})
          commit(TYPES.SET_ACCOUNT_PROCESSING, false)
          commit(TYPES.SET_POSTS_PROCESSING, false)
        })
    },
    fetchPostByAuthor({commit, state}, {chain, tag, start_author, start_permlink, limit}) {
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