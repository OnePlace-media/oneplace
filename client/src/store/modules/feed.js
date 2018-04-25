import Api from '../../plugins/api'
import CONSTANTS from '@oneplace/constants'
import moment from 'moment'
import Vue from 'vue'

const TYPES = {
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA',
  SET_POSTS_PROCESSIGN: 'SET_POSTS_PROCESSIGN',
  SET_POSTS_FIRST_FETCHED: 'SET_POSTS_FIRST_FETCHED',
  SET_POSTS: 'SET_POSTS',
  APPEND_POSTS: 'APPEND_POSTS',
  UPDATE_POST: 'UPDATE_POST'
}


function createState() {
  return {
    posts: {
      firstFetched: false,
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
    [TYPES.SET_POSTS_PROCESSIGN](state, {processing = true}) {
      state.posts.processing = processing
    },
    [TYPES.SET_POSTS_FIRST_FETCHED](state) {
      state.posts.firstFetched = true
    },
    [TYPES.SET_POSTS](state, {collection = []}) {
      state.posts.collection = collection
    },
    [TYPES.APPEND_POSTS](state, {collection = []}) {
      state.posts.collection = state.posts.collection.concat(collection)
    },
    [TYPES.UPDATE_POST](state, {post}) {
      state.posts.collection = state.posts.collection.map(_post => _post.id === post.id ? post : _post)
    }
  }

  const actions = {
    fetchState({commit}, {chain, username}) {
      commit(TYPES.SET_POSTS_PROCESSIGN, {processing: true})
      return Api
        .getFeed(chain, {username, start: 0, end: 10})
        .then(response => {
          commit(TYPES.SET_POSTS_FIRST_FETCHED)
          commit(TYPES.SET_POSTS, {collection: response.data})
          commit(TYPES.SET_POSTS_PROCESSIGN, {processing: false})
        })
    },
    appendPosts({commit, state}, {chain, username, limit = 15}) {
      commit(TYPES.SET_POSTS_PROCESSIGN, {processing: true})
      const lastPost = state.posts.collection[state.posts.collection.length - 1]
      const start = state.posts.collection.length
      return Api
        .getDiscussionsByFeed(chain, {username, start_author: lastPost.author, start_permlink: lastPost.permlink, limit})
        .then(response => {
          response.data.shift()
          commit(TYPES.APPEND_POSTS, {collection: response.data})
          commit(TYPES.SET_POSTS_PROCESSIGN, {processing: false})
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