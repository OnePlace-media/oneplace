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
  SET_POSTS_DATA: 'SET_POSTS_DATA',
  APPEND_POSTS_DATA: 'APPEND_POSTS_DATA',

  SET_POSTS_AUTHOR_PROCESSING: 'SET_POSTS_AUTHOR_PROCESSING',
  SET_POSTS_AUTHOR_DATA: 'SET_POSTS_AUTHOR_DATA',
  APPEND_POSTS_AUTHOR_DATA: 'APPEND_POSTS_AUTHOR_DATA',

  SET_TAGS: 'SET_TAGS',
  APPEND_TAGS: 'APPEND_TAGS',
  SET_SHOW_ALL_TAGS: 'SET_SHOW_ALL_TAGS',
  SELECT_TAG: 'SELECT_TAG',
  REMOVE_TAG: 'REMOVE_TAG',
  CLEAR_TAGS_FILTER: 'CLEAR_TAGS_FILTER',

  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
}

function getTagsFromPosts(username, posts) {
  const tagsObj = posts.reduce((obj, post) => {
    post.tags.forEach(tag => {
      if (!obj[tag]) obj[tag] = {count: 0, owner: false}
      obj[tag].count++
      if (!obj[tag].owner)
        obj[tag].owner = post.author === username
    })
    return obj
  }, {})

  return Object.keys(tagsObj).map(tag => {
    return {
      text: tag,
      count: tagsObj[tag].count,
      status: null,
      owner: tagsObj[tag].owner
    }
  })
}

function sortTags(a, b) {
  return b.count - a.count
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
    },
    postsAuthor: {
      processing: true,
      collection: []
    },
    tags: {
      postIds: [],
      collection: [],
      showAllTags: false,
      include: {},
      exclude: {}
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

    [TYPES.SET_POSTS_AUTHOR_PROCESSING](state, flag) {
      state.postsAuthor.processing = flag
    },
    [TYPES.APPEND_POSTS_AUTHOR_DATA](state, {posts}) {
      state.postsAuthor.collection = [...state.postsAuthor.collection, ...posts]
    },
    [TYPES.SET_POSTS_AUTHOR_DATA](state, {posts}) {
      state.postsAuthor.collection = posts
    },

    [TYPES.SET_TAGS](state, {username, posts}) {
      state.tags.collection = getTagsFromPosts(username, posts)
      state.tags.collection.sort(sortTags)
    },
    [TYPES.APPEND_TAGS](state, {username, posts}) {
      getTagsFromPosts(username, posts).forEach(_tag => {
        const findIndex = state.tags.collection.findIndex(tag => tag.text === _tag.text)
        if (~findIndex) {
          state.tags.collection[findIndex].count += _tag.count
          if (state.tags.collection[findIndex].owner)
            state.tags.collection[findIndex].owner = _tag.owner
        } else
          state.tags.collection.push(_tag)
      })
      state.tags.collection.sort(sortTags)
    },
    [TYPES.SET_SHOW_ALL_TAGS](state, flag) {
      state.tags.showAllTags = flag
    },

    [TYPES.SELECT_TAG](state, {tag}) {
      if (state.tags.exclude[tag.text])
        Vue.delete(state.tags.exclude, tag.text)
      else {
        if (!state.tags.include[tag.text])
          Vue.set(state.tags.include, tag.text, tag)
        else
          Vue.delete(state.tags.include, tag.text)
      }
    },
    [TYPES.REMOVE_TAG](state, {tag}) {
      if (state.tags.include[tag.text])
        Vue.delete(state.tags.include, tag.text)

      if (!state.tags.exclude[tag.text])
        Vue.set(state.tags.exclude, tag.text, tag)
      else
        Vue.delete(state.tags.exclude, tag.text)
    },
    [TYPES.CLEAR_TAGS_FILTER](state) {
      state.tags.exclude = {}
      state.tags.include = {}
    },

    [TYPES.CLEAR_ALL_DATA](state) {
      state.tags.collection = []
      state.tags.showAllTags = false
      state.tags.include = {}
      state.tags.exclude = {}
      state.tags.postIds = {}

      state.chain = null
      state.account.data = {}
      state.posts.collection = []
      state.postsAuthor.collection = []
    }
  }

  const actions = {
    fetchState({commit}, {chain, username}) {
      commit(TYPES.SET_ACCOUNT_PROCESSING, true)

      function setData({data, posts}) {
        commit(TYPES.SET_ACCOUNT_DATA, {data})
        commit(TYPES.SET_CHAIN, chain)
        commit(TYPES.SET_POSTS_DATA, {posts})
        commit(TYPES.SET_TAGS, {username, posts})
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
            commit(TYPES.APPEND_POSTS_DATA, {posts})
            commit(TYPES.APPEND_TAGS, {username: start_author, posts})
            commit(TYPES.SET_POSTS_PROCESSING, false)
          }
          return response.data
        })
    },
    fetchPostByAuthor({commit, state}, {chain, author, start_permlink, limit}) {
      commit(TYPES.SET_POSTS_AUTHOR_PROCESSING, true)
      return Api.getDiscussionsByCreated(chain, {author, start_permlink, limit})
        .then(response => {
          if (author === state.account.data.name) {
            response.data.shift()
            const posts = response.data
            commit(TYPES.APPEND_POSTS_AUTHOR_DATA, {posts})
            commit(TYPES.APPEND_TAGS, {username: author, posts})
            commit(TYPES.SET_POSTS_AUTHOR_PROCESSING, false)
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