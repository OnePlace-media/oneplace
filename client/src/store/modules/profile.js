import Api from '../../plugins/api'
import CONSTANTS from '@oneplace/constants'
import moment from 'moment'
import Vue from 'vue'

const TYPES = {
  SET_CHAIN: 'SET_CHAIN',
  SET_ACCOUNT_DATA: 'SET_ACCOUNT_DATA',
  SET_ACCOUNT_PROCESSING: 'SET_ACCOUNT_PROCESSING',
  SET_ACCOUNT_FOLLOW_PROCESSING: 'SET_ACCOUNT_FOLLOW_PROCESSING',

  SET_POSTS_PROCESSING: 'SET_POSTS_PROCESSING',
  SET_POSTS: 'SET_POSTS',
  APPEND_POSTS: 'APPEND_POSTS',

  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
}

function createState() {
  return {
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
}

export default () => {
  const state = createState()

  const mutations = {

    [TYPES.CLEAR_ALL_DATA](state) {
      Object.assign(state, createState())
    },
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
    [TYPES.SET_POSTS](state, {posts}) {
      state.posts.collection = posts
    },
    [TYPES.APPEND_POSTS](state, {posts}) {
      state.posts.collection = [...state.posts.collection, ...posts]
    },
  }

  const actions = {
    fetchState({commit}, {chain, username}) {
      commit(TYPES.SET_ACCOUNT_PROCESSING, true)

      function setData({data, posts}) {
        commit(TYPES.SET_ACCOUNT_DATA, {data})
        commit(TYPES.SET_CHAIN, chain)
        commit(TYPES.SET_POSTS, {posts})
        commit(TYPES.SET_ACCOUNT_PROCESSING, false)
        commit(TYPES.SET_POSTS_PROCESSING, false)
      }

      function postSort(field) {
        return (a, b) => {
          const aCreated = a[field] || a.created
          const bCreated = b[field] || b.created
          return new Date(bCreated).getTime() - new Date(aCreated).getTime()
        }
      }

      if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS) {
        return Api
          .getAccount(chain, {username})
          .then(response => {
            const data = response.data
            return Api.getBlog(chain, {username}).then(res => [data, res])
          })
          .then(([data, response]) => {
            const posts = response.data
            posts.sort(postSort('reblog_on'))
            setData({data, posts})
          })
      } else {
        return Api.getState(chain, {path: `@${username}`})
          .then(response => {
            if (response.data.accounts[username]) {
              const posts = Object.keys(response.data.content).map(link => response.data.content[link])
              posts.sort(postSort('first_reblogged_on'))
              const data = response.data.accounts[username]
              setData({data, posts})
            } else {
              const error = new Error('account not found')
              error.status = 404
              throw error
            }
          })
      }
    },
    fetchPostByBlog({commit, state}, {chain, tag, start_author, start_permlink, limit}) {
      commit(TYPES.SET_POSTS_PROCESSING, true)
      return Api.getDiscussionsByBlog(chain, {tag, start_author, start_permlink, limit})
        .then(response => {
          if (tag === state.account.data.name) {
            response.data.shift()
            const posts = response.data
            commit(TYPES.APPEND_POSTS, {posts})
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