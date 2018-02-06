import Api from '../../plugins/api'
const CONSTANTS = require('@oneplace/constants')

export default () => {
  const state = {
    $router: {
      from: null
    },
    params: {
      [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: {
        processing: true,
        time: null,
        feedPrice: {},
        rewardFunds: {},
        globalProps: {}
      },
      [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: {
        processing: true,
        time: null,
        goldPrice: null,
        feedPrice: {},
        rewardFunds: {},
        globalProps: {},
      }
    }
  }

  const mutations = {
    setRouterFrom(state, {target}) {
      state.$router.from = target
    },
    setParams(state, {chain, params}) {
      state.params[chain] = params
    },
    setParamsProcessing(state, {chain, flag}) {
      state.params[chain].processing = flag
    }
  }

  const actions = {
    fetchParams({commit, state}, {chain, $chains}) {
      commit('setParamsProcessing', {chain, flag: true})
      $chains.setChain(chain)
      const params = state.params[chain]
      const tasks = []
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

      return Promise.all(tasks).then(() => {
        commit('setParams', {chain, params})
        commit('setParamsProcessing', {chain, flag: false})
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