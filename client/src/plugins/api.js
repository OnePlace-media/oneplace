import Vue from 'vue'
const CONSTANTS = require('@oneplace/constants')

export default {
  getTrends(chain, tags, exclude) {
    return Vue.axios.get('/posts/trendByTags', {
      params: {
        exclude: exclude,
        chain: chain,
        tags: tags.map(t => t.text.toLowerCase())
      }
    })
  },
  saveTags(id, chain, tags) {
    return Vue.axios.post(`/users/${id}/tags`, {chain, tags})
  },
  saveAccount(id, chain, username, sign) {
    return Vue.axios.post(`/users/${id}/account`, {chain, sign, username})
  },
  removeAccount(id, chain, username) {
    return Vue.axios.delete(`/users/${id}/account`, {params: {chain, username}})
  },
  createComment(chain, author, permlink, body, parentAuthor, parentPermlink) {
    return Vue.axios.post(`/posts/${chain}/comment`, {author, body, parentAuthor, parentPermlink, permlink})
  },
  vote(chain, voter, author, permlink, weight) {
    return Vue.axios.post(`/posts/${chain}/vote`, {voter, author, permlink, weight})
  },
  follow(chain, follower, following, unfollow) {
    return Vue.axios.post(`/accounts/${chain}/follow`, {chain, follower, following, unfollow})
  },
  updateUser(id, data) {
    return Vue.axios.patch(`/users/${id}`, data)
  },
  deleteComment(chain, author, permlink) {
    return Vue.axios.post(`/posts/${chain}/delete_comment`, {author, permlink})
  },
  params() {
    return Vue.axios.get(`/params`)
  },

  // GET BLOCKCHAINS PROXY OPERATIONS
  getContent(chain, username, permlink) {
    return Vue.axios.get(`/blockchains/${chain}/getContent`, {params: {username, permlink}})
  },
  getState(chain, {path}) {
    return Vue.axios.get(`/blockchains/${chain}/getState`, {params: {path}})
  },
  getDiscussionsByBlog(chain, {tag, start_author, start_permlink, limit}) {
    return Vue.axios.get(`/blockchains/${chain}/getDiscussionsByBlog`, {params: {tag, start_author, start_permlink, limit}})
  },
  getDiscussionsByAuthorBeforeDate(chain, {author, start_permlink, before_date, limit}) {
    return Vue.axios.get(`/blockchains/${chain}/getDiscussionsByAuthorBeforeDate`, {params: {author, start_permlink, before_date, limit}})
  },
  getDiscussionsByCreated(chain, {author, start_permlink, limit}) {
    return Vue.axios.get(`/blockchains/${chain}/getDiscussionsByCreated`, {params: {author, start_permlink, limit}})
  },
  getRepliesByPermlink(chain, username, permlink) {
    return Vue.axios.get(`/blockchains/${chain}/repliesByPermLink`, {params: {username, permlink}})
  },
  getFollowers(chain, {following, startFollower, followType, limit}) {
    return Vue.axios.get(`/blockchains/${chain}/getFollowers`, {params: {following, startFollower, followType, limit}})
  }
}