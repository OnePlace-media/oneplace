import Vue from 'vue'
const CONSTANTS = require('@oneplace/constants')
export default {
  /** Common state mutations */
  setChain(state, {chain}) {
    state.chain = chain
  },
  set404Page(state, flag) {
    state.page404Flag = flag
  },

  /** User state mutations */
  setUserAccounts(state, accounts) {
    state.user.accounts[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].items = accounts.filter(acc => acc.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS)
    state.user.accounts[CONSTANTS.BLOCKCHAIN.SOURCE.STEEM].items = accounts.filter(acc => acc.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM)
  },
  setUserAccountActive(state, {chain, accountId}) {
    state.user.accounts[chain].active = accountId
  },
  setDropDown(state, flag) {
    state.user.dropDownOpen = flag
  },

  /** Trends state mutations  */
  setTrends(state, {chain, trends}) {
    state.trends.data[chain].collection = trends
  },
  setTrendsProcessing(state, {chain, flag}) {
    state.trends.data[chain].processing = flag
  },
  setTrendsActiveTag(state, tag) {
    state.trends.activeTag = tag
  },
  clearTrends(state) {
    state.trends.activeTag = null
    state.trends.data[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].processing = false
    state.trends.data[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].collection = []
    state.trends.data[CONSTANTS.BLOCKCHAIN.SOURCE.STEEM].processing = false
    state.trends.data[CONSTANTS.BLOCKCHAIN.SOURCE.STEEM].collection = []
  },

  /** Welcome page mutations */
  updateWelcomeTags(state, tags) {
    state.welcome.tags = tags
  },
  toggleWelcomeTag(state, tag) {
    if (!~state.welcome.tags.indexOf(tag)) {
      state.welcome.tags.push(tag)
    } else {
      state.welcome.tags = state.welcome.tags.filter(item => item !== tag)
    }
  },
  setWelcomeStep(state, step) {
    state.welcome.step = step
  },
  setWelcomeChain(state, chain) {
    state.welcome.chain = chain
  },

  /** TagsForm mutations */
  toggleUserTag(state, {tag, chain}) {
    if (!~state.tagsForm.storages[chain].findIndex(_tag => _tag.text === tag.text)) {
      state.tagsForm.storages[chain].push(tag)
    } else {
      state.tagsForm.storages[chain] = state.tagsForm.storages[chain].filter(_tag => _tag.text !== tag.text)
    }
  },
  addUserTag(state, {tag, chain}) {
    if (!~state.tagsForm.storages[chain].findIndex(_tag => _tag.text === tag.text)) {
      state.tagsForm.storages[chain].push(tag)
    }
  },
  setInitFormTags(state, tags) {
    state.welcome.chain = null
    state.tagsForm.storages[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS] = tags.filter(tag => tag.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS)
    state.tagsForm.storages[CONSTANTS.BLOCKCHAIN.SOURCE.STEEM] = tags.filter(tag => tag.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM)
  },
  setTagsFormChain(state, chain) {
    state.tagsForm.chain = chain
  },
  setTagsFormStorages(state, {chain, tags}) {
    state.tagsForm.storages[chain] = tags
  },

  /** AccountForm mutations */
  setAccountFormChain(state, chain) {
    state.accountForm.chain = chain
  },

  /** PostView mutations */
  setPostViewData(state, data) {
    state.postView.post = data
  },
  setPostViewProcessing(state, flag) {
    state.postView.processing = flag
  },
  setPostViewRepliesData(state, data) {
    state.postView.replies = data
  },
  addPostViewReplie(state, comment) {
    state.postView.replies.unshift(comment)
  },
  setPostViewRepliesProcessing(state, flag) {
    state.postView.repliesProcessing = flag
  },


  setRouterFrom(state, {from}){
    state.$router.from = from
  }
}