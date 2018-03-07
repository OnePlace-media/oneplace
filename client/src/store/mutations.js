import Vue from 'vue'
import moment from 'moment'
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
  sortPostViewReplies(state, typeOfOrder = CONSTANTS.ORDER_BY_LIST.TRENDING) {
    function sort(a, b) {
      let result = 0
      if (typeOfOrder === CONSTANTS.ORDER_BY_LIST.RECENT_FIRST)
        result = moment(a.created).unix() < moment(b.created).unix()
      else if (typeOfOrder === CONSTANTS.ORDER_BY_LIST.OLDEST_FIRTS)
        result = moment(a.created).unix() > moment(b.created).unix()
      else if (typeOfOrder === CONSTANTS.ORDER_BY_LIST.TRENDING)
        result = +a.payout < +b.payout
      else if (typeOfOrder === CONSTANTS.ORDER_BY_LIST.POPULAR) {
        const filter = vote => +vote.weight > 0 || +vote.percent > 0
        result = a.active_votes.filter(filter).length < b.active_votes.filter(filter).length
      }

      return result === 0 ? 0 : (result ? 1 : -1)
    }

    (function reSort(arr) {
      arr.sort(sort)
      arr = arr.map(item => {
        if (item.replies) {
          item.replies = reSort(item.replies)
        }
        return item
      })
      return arr
    })(state.postView.replies)
  },
  setParams(state, {chain, params}) {
    state.params[chain] = params
  },
  setParamsProcessing(state, {chain, flag}) {
    state.params[chain].processing = flag
  },

  setReplieDeleteProcessing(state, flag) {
    state.postView.replieDeleteProcessing = flag
  },
  updateReplie(state, {replie}) {
    function updateReplie(replies, replie) {
      return replies.map(_replie => {
        if (replie.author === _replie.author && replie.permlink === _replie.permlink)
          _replie = Object.assign(_replie, replie)
        else if (_replie.replies && _replie.replies.length)
          _replie.replies = updateReplie(_replie.replies, replie)

        return _replie
      })
    }

    state.postView.replies = updateReplie(state.postView.replies, replie)
  },
  deleteReplie(state, {replie}) {
    function deleteReplie(replies, replie) {
      return replies.filter(_replie => {
        let result = true
        if (replie.author === _replie.author && replie.permlink === _replie.permlink)
          result = false
        else if (_replie.replies && _replie.replies.length)
          _replie.replies = deleteReplie(_replie.replies, replie)
        return result
      })
    }

    state.postView.replies = deleteReplie(state.postView.replies, replie)
  }
}