import Api from '../../plugins/api'
const CONSTANTS = require('@oneplace/constants')
const TYPES = {
  SET_PROCESSING: 'SET_PROCESSING',
  SET_TREND: 'SET_TREND',
  SET_TAG: 'SET_TAG'
}

export default () => {
  const state = {
    tag: null,
    processing: false,
    trend: {
      posts: [],
      recentPosts: []
    }
  }

  const mutations = {
    [TYPES.SET_PROCESSING](state, flag) {
      state.processing = flag
    },
    [TYPES.SET_TAG](state, tag) {
      state.tag = tag
    },
    [TYPES.SET_TREND](state, trend) {
      state.trend.posts = trend.posts
      state.trend.recentPosts = trend.recentPosts
    }
  }

  const actions = {
    fetchTagData({commit}, {chain, tag}) {
      commit(TYPES.SET_PROCESSING, true)
      commit(TYPES.SET_TAG, tag)
      return Api
        .getTrends(chain, [{text: tag}], [])
        .then(response => {
          commit(TYPES.SET_TREND, response.data[0])
          commit(TYPES.SET_PROCESSING, false)
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