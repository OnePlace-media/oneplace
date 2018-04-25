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
  getDrafts(userId) {
    return Vue.axios.get(`/users/${userId}/drafts`)
  },
  createDraft(userId, data) {
    return Vue.axios.post(`/users/${userId}/drafts`, data)
  },
  saveDraft(userId, data, draft) {
    return Vue.axios.put(`/users/${userId}/drafts/${draft.id}`, data)
  },
  deleteDraft(draft) {
    return Vue.axios.delete(`/users/${draft.userId}/drafts/${draft.id}`)
  },
  saveTags(id, chain, tags) {
    return Vue.axios.post(`/users/${id}/tags`, {chain, tags})
  },
  saveAccount(id, chain, username, sign, isPostingKey) {
    return Vue.axios.post(`/users/${id}/account`, {chain, sign, username, isPostingKey})
  },
  removeAccount(id, chain, username) {
    return Vue.axios.delete(`/users/${id}/account`, {params: {chain, username}})
  },
  savePost(chain, author, data) {
    data.author = author
    return Vue.axios.post(`/posts/${chain}/comment`, data)
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
  uploadImage(image, config) {
    const data = new FormData()
    data.append('image', image)
    return Vue.axios.post('/images/upload', data, config)
  },
  // GET BLOCKCHAINS PROXY OPERATIONS
  getContent(chain, username, permlink) {
    return Vue.axios.get(`/blockchains/${chain}/getContent`, {params: {username, permlink}})
  },
  getState(chain, {path}) {
    return Vue.axios.get(`/blockchains/${chain}/getState`, {params: {path}})
  },
  getAccount(chain, {username}) {
    return Vue.axios.get(`/blockchains/${chain}/getAccount`, {params: {username}})
  },
  getBlog(chain, {username}) {
    return Vue.axios.get(`/blockchains/${chain}/getBlog`, {params: {username}})
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
  getDiscussionsByFeed(chain, {username, start_author, start_permlink, limit}) {
    return Vue.axios.get(`/blockchains/${chain}/getDiscussionsByFeed`, {params: {username, start_author, start_permlink, limit}})
  },
  getRepliesByPermlink(chain, username, permlink) {
    return Vue.axios.get(`/blockchains/${chain}/repliesByPermLink`, {params: {username, permlink}})
  },
  getFollowers(chain, {following, startFollower, followType, limit}) {
    return Vue.axios.get(`/blockchains/${chain}/getFollowers`, {params: {following, startFollower, followType, limit}})
  },
  getFeed(chain, {username, start, end}) {
    return Vue.axios.get(`/blockchains/${chain}/getFeed`, {params: {username, start, end}})
  }
}