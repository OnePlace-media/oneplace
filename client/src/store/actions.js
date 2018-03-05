import Api from '../plugins/api'
const CONSTANTS = require('@oneplace/constants')
const async = require('async')
import Vue from 'vue'

export default {
  fetchTrends({commit, state}, {chain, tags}) {
    return new Promise((resolve, reject) => {
      if (!state.trends.data[chain].processing) {
        commit('setTrendsProcessing', {chain, flag: true})
        let trends = []
        let exclude = []
        commit('setTrends', {chain, trends})
        async.eachSeries(tags, (tag, cb) => {
          const index = trends.push({tag: tag.text, posts: [], recentPosts: []}) - 1
          Api.getTrends(chain, [tag], exclude)
            .then(response => {
              exclude = exclude.concat(response.data[0].posts.map(post => post.id))
              trends[index].posts = response.data[0].posts
              trends[index].recentPosts = response.data[0].recentPosts
              commit('setTrends', {chain, trends})
              cb()
            })
            .catch(e => cb(e))
        }, err => {
          commit('setTrendsProcessing', {chain, flag: false})
          if (err) reject(err)
          else resolve(trends)
        })
      } else {
        resolve()
      }
    })
  },
  fetchPostByPermlink({commit}, {chain, username, permlink}) {
    commit('setPostViewProcessing', true)
    commit('setPostViewData', null)
    return Api
      .getContent(chain, username, permlink)
      .then(response => {
        commit('setPostViewProcessing', false)
        commit('setPostViewData', response.data)
        return response.data
      })
  },
  fetchParams({commit, state}, {chain, $chains}) {
    commit('setParamsProcessing', {chain, flag: true})
    $chains.setChain(chain)
    const params = state.params[chain]
    const tasks = []
    if (!state.params[chain].time || state.params[chain].time < new Date().getTime() - 5 * 60 * 1000) {
      params.time = new Date().getTime()
      tasks.push(
        new Promise((resolve, reject) => {
          $chains.client.api.getDynamicGlobalProperties((err, result) => {
            if (err) reject
            else {
              params.globalProps = result
              if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS) {
                params.rewardFunds.reward_balance = result.total_reward_fund_steem.replace(
                  ' GOLOS',
                  ''
                )
                params.rewardFunds.recent_claims = result.total_reward_shares2
              }
              params.steem_per_mvests = 1000000.0 *
                parseFloat(result['total_vesting_fund_steem'].split(' ')[0]) /
                parseFloat(result['total_vesting_shares'].split(' ')[0])
              resolve()
            }
          })
        })
      )

      tasks.push(new Promise((resolve, reject) => {
        $chains.client.api.getCurrentMedianHistoryPrice((err, result) => {
          if (err) reject(err)
          else {
            params.feedPrice = result
            resolve()
          }
        })
      }))

      if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM) {
        tasks.push(
          new Promise((resolve, reject) => {
            $chains.client.api.getRewardFund('post', (err, result) => {
              if (err) reject
              else {
                params.rewardFunds.reward_balance = result.reward_balance.replace(
                  ' STEEM',
                  ''
                )
                params.rewardFunds.recent_claims = result.recent_claims
                resolve()
              }
            })
          })
        )
      } else {
        tasks.push(Api.params().then(response => {
          params.goldPrice = response.data.goldPrice
        }))
      }
    }

    return Promise.all(tasks).then(() => {
      commit('setParams', {chain, params})
      commit('setParamsProcessing', {chain, flag: false})
    })
  },
  fetchRepliesByPermlink({commit, state}, {chain, username, permlink}) {
    commit('setPostViewRepliesProcessing', true)
    commit('setPostViewRepliesData', [])
    return Api
      .getRepliesByPermlink(chain, username, permlink)
      .then(response => {
        if (state.postView.post && state.postView.post.author === username && state.postView.post.permlink === permlink) {
          response.data.reverse()
          commit('setPostViewRepliesProcessing', false)
          commit('setPostViewRepliesData', response.data)
          commit('sortPostViewReplies')
        }
        return response.data
      })
  },

  deleteComment({commit, state}, {chain, author, permlink}) {
    commit('setReplieDeleteProcessing', true)
    return Api
      .deleteComment(chain, author, permlink)
      .then(response => {
        commit('removeReplie', {author, permlink})
        commit('setReplieDeleteProcessing', false)
      })
  },

  removeAccount({commit}, {id, chain, username}) {
    return Api.removeAccount(id, chain, username)
  },
  saveUserTags({commit}, {id, chain, tags}) {
    commit('setTagsFormStorages', {chain, tags})
    return Api.saveTags(id, chain, tags.map(tag => tag.text))
  },
  saveAccountWelcome({commit}, {id, chain, username, sign}) {
    return Api.saveAccount(id, chain, username, sign).then(() => {
      commit('setWelcomeStep', CONSTANTS.WELCOME.STEPS.SETUP_TAGS)
    })
  },
  saveAccount({commit}, {id, chain, username, sign}) {
    return Api.saveAccount(id, chain, username, sign)
  },
  removeUserTag({commit, state}, {tag, userId}) {
    commit('toggleUserTag', {tag, chain: tag.chain})
    return Api.saveTags(userId, tag.chain, state.tagsForm.storages[tag.chain].map(tag => tag.text))
  },
  clearUserTags({commit, state}, {chain, userId}) {
    const tags = []
    commit('setTagsFormStorages', {chain, tags})
    return Api.saveTags(userId, chain, tags)
  },
  toggleDropDown({commit, state}) {
    commit('setDropDown', !state.user.dropDownOpen)
  },
  switchAccount({commit, state}, {accounts, targetAccId}) {
    const length = accounts.length
    let index, acc
    if (targetAccId) {
      index = accounts.findIndex(acc => acc.id === targetAccId)
      index = ~index ? index : 0
      acc = accounts[index]
    } else {
      const currentAccount = accounts.find(acc => acc.id === state.user.accounts[state.chain].active)
      if (currentAccount) {
        const accountsByChain = accounts.filter(account => account.chain === state.chain)
        index = accountsByChain.findIndex(acc => acc.id === currentAccount.id)
        const lengthByChain = accountsByChain.length
        if (~index) {
          index = lengthByChain - (index + 1) ? index + 1 : 0
        } else {
          index = 0
        }
        acc = accountsByChain[index]
      } else {
        acc = accounts.filter(account => account.chain === state.chain)[0]
      }
    }

    Vue.localStorage.set(`accLast-${acc.chain}`, acc.id)
    commit('setUserAccountActive', {chain: acc.chain, accountId: acc.id})
    commit('setDropDown', false)

    if (state.chain !== acc.chain) {
      Vue.router.push({name: 'chain-trend', params: {chain: acc.chain}})
    }
  },
  vote({commit, state}, {chain, post, account, isLike, weight = 10000}) {
    if (account.username) {
      const alreadyLike = !!post.active_votes.find(vote => vote.voter === account.username && (vote.percent > 0 || vote.weight > 0))
      const alreadyDisLike = !!post.active_votes.find(vote => vote.voter === account.username && (vote.percent < 0 || vote.weight < 0))
      weight = isLike ? weight : -10000
      if ((alreadyLike && isLike) || (alreadyDisLike && !isLike)) {
        weight = 0
      }

      return Api.vote(
        chain,
        account.username,
        post.author,
        post.permlink,
        weight
      )
        .then(() => {
          return Api.getContent(chain, post.author, post.permlink)
        })
        .then(response => {
          post.payout = response.data.payout
          post.active_votes = response.data.active_votes
        })
    }
  }
}
