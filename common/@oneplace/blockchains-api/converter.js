const CONSTANT_S = 2000000000000
const STEEMIT_VOTE_REGENERATION_SECONDS = 5 * 60 * 60 * 24
const STEEM_100_PERCENT = 10000
const VOTE_POWER_REVERSE_RATE = 40
const CONSTANTS = require('@oneplace/constants')
const moment = require('moment')

class Converter {
  static calculateRshares(account, weight) {
    const voting_power = account.voting_power
    let total_vests = parseFloat(account.vesting_shares.split(' ')[0])

    if (account.received_vesting_shares)
      total_vests += parseFloat(account.received_vesting_shares.split(' ')[0])

    if (account.delegated_vesting_shares)
      total_vests -= parseFloat(account.delegated_vesting_shares.split(' ')[0])

    const vote_pct = weight
    const max_vote_denom = VOTE_POWER_REVERSE_RATE * STEEMIT_VOTE_REGENERATION_SECONDS / (60 * 60 * 24)
    let used_power = voting_power * vote_pct / STEEM_100_PERCENT
    used_power = (used_power + max_vote_denom - 1) / max_vote_denom
    let rshares = total_vests * used_power / STEEM_100_PERCENT
    return Math.floor(rshares * 1000000)
  }

  static calculateVshares(rshares) {
    return Math.pow(rshares + CONSTANT_S, 2) - Math.pow(CONSTANT_S, 2)
  }

  static voteToFiat(vote, chain, params, post, full = true) {
    const CURRENCY_Q = CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS ? params.goldPrice : 1
    const feedPrice = params.feedPrice
    const base = parseFloat(feedPrice.base.split(' ')[0]) / parseFloat(feedPrice.quote.split(' ')[0])
    const {recent_claims, reward_balance} = params.rewardFunds
    const active_votes = post.active_votes

    let result

    if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM) {
      if (full) {
        result = (+post.payout + (vote.rshares / recent_claims * reward_balance * base)).toFixed(2)
      } else {
        result = (vote.rshares / recent_claims * reward_balance * base).toFixed(2)
      }
    } else {
      const time = moment(vote.time + '+00:00').unix()
      const lastPayout = moment(post.last_payout).unix()
      const created = moment(post.created).unix()

      if (full) {
        const activeRshares =
          active_votes.reduce((sum, _vote) => {
            const _time = moment(_vote.time + '+00:00').unix()
            if (lastPayout < created || _time > lastPayout) {
              sum += +_vote.rshares
            }
            return sum
          }, 0) + vote.rshares

        const votesValue =
          Converter.calculateVshares(activeRshares) /
          recent_claims *
          reward_balance *
          base

        result = (
          (post.total_payout_value + votesValue) *
          CURRENCY_Q
        ).toFixed(2)
      } else {
        const activeRshares = active_votes.reduce((sum, _vote) => {
          const _time = moment(_vote.time + '+00:00').unix()
          if (!lastPayout || (time > lastPayout && _time > lastPayout) || (time < lastPayout && _time < lastPayout)) {
            sum += +_vote.rshares
          }
          return sum
        }, 0)

        const percentRshares = vote.rshares * 100 / activeRshares

        const votesValue =
          Converter.calculateVshares(activeRshares) /
          recent_claims *
          reward_balance *
          base

        result = (((votesValue / 100) * percentRshares) * CURRENCY_Q).toFixed(2)
      }
    }

    return result
  }
}

export default Converter