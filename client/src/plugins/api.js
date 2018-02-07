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
  getPostByPermlink(chain, username, permlink) {
    return Vue.axios.get(`/posts/${chain}/byPermLink`, {params: {username, permlink}})
  },
  getRepliesByPermlink(chain, username, permlink) {
    return Vue.axios.get(`/posts/${chain}/repliesByPermLink`, {params: {username, permlink}})
  },
  createComment(chain, author, permlink, body, parentAuthor, parentPermlink) {
    return Vue.axios.post(`/posts/${chain}/comment`, {author, body, parentAuthor, parentPermlink})
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
  params() {
    return Vue.axios.get(`/params`)
  },
  getAccountByName(chain, username) {
    return Vue.axios.get(`/accounts/${chain}/byName`, {params: {username}})
  },
  getDiscussionsByBlog(chain, {tag, start_author, start_permlink, limit}) {
    return Vue.axios.get(`/posts/${chain}/getDiscussionsByBlog`, {params: {tag, start_author, start_permlink, limit}})
  },
  getDiscussionsByAuthorBeforeDate(chain, {author, before_date, limit}) {
    return Vue.axios.get(`/posts/${chain}/getDiscussionsByAuthorBeforeDate`, {params: {author, before_date, limit}})
  },
  getFollowers(chain, {following, startFollower, followType, limit}) {
    return Vue.axios.get(`/accounts/${chain}/getFollowers`, {params: {following, startFollower, followType, limit}})
  }
}