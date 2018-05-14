const CONSTANT_S = 2000000000000
const STEEMIT_VOTE_REGENERATION_SECONDS = 5 * 60 * 60 * 24
const STEEM_100_PERCENT = 10000
const CONSTANTS = require('@oneplace/constants')
const VOTE_POWER_REVERSE_RATE = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: 40,
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: 10,
}

const moment = require('moment')

class Converter {
  static calculateRshares(chain, account, weight) {
    const voting_power = account.voting_power
    let total_vests = parseFloat(account.vesting_shares.split(' ')[0])

    if (account.received_vesting_shares)
      total_vests += parseFloat(account.received_vesting_shares.split(' ')[0])

    if (account.delegated_vesting_shares)
      total_vests -= parseFloat(account.delegated_vesting_shares.split(' ')[0])

    const vote_pct = weight
    const max_vote_denom = VOTE_POWER_REVERSE_RATE[chain] * STEEMIT_VOTE_REGENERATION_SECONDS / (60 * 60 * 24)
    let used_power = voting_power * vote_pct / STEEM_100_PERCENT
    used_power = (used_power + max_vote_denom - 1) / max_vote_denom
    let rshares = total_vests * used_power / STEEM_100_PERCENT
    return Math.floor(rshares * 1000000)
  }

  static calculateVshares(rshares) {
    return Math.pow(rshares + CONSTANT_S, 2) - Math.pow(CONSTANT_S, 2)
  }

  static voteToFiat(vote, chain, params, post, append = true) {
    const CHAINS = CONSTANTS.BLOCKCHAIN.SOURCE
    const MODES = CONSTANTS.BLOCKCHAIN.MODES
    const CURRENCY_Q = chain === CHAINS.GOLOS ? params.goldPrice : 1
    const feedPrice = params.feedPrice
    const base = parseFloat(feedPrice.base.split(' ')[0]) / parseFloat(feedPrice.quote.split(' ')[0])
    const {recent_claims, reward_balance} = params.rewardFunds
    const active_votes = post.active_votes
    const lastPayout = moment(post.last_payout).unix()

    let result
    const isLiner =
      chain === CHAINS.STEEM ||
      post.mode !== MODES.ARCHIVED ||
      moment(post.created).unix() > moment("2018-04-04T00:00:00+00:00").unix()

    if (isLiner) {
      const allPayout = +post.pending_payout + +post.total_payout
      const sumRshares = active_votes.reduce((sum, _vote) => sum += +_vote.rshares, 0)
      // const q = ((reward_balance * base) / recent_claims) * CURRENCY_Q
      const q = allPayout / sumRshares
      if (append)
        result = lastPayout ? +post.payout : (+post.payout + vote.rshares * q).toFixed(2)
      else
        result = (vote.rshares * q).toFixed(2)
    } else {
      const time = moment(vote.time + '+00:00').unix()
      const created = moment(post.created).unix()

      if (append) {
        if (post.mode === MODES.ARCHIVED)
          result = (post.total_payout_value * CURRENCY_Q).toFixed(2)
        else {
          const currentActiveRshares =
            active_votes.reduce((sum, _vote) => {
              const _time = moment(_vote.time + '+00:00').unix()
              if (!lastPayout || _time > lastPayout) {
                sum += +_vote.rshares
              }
              return sum
            }, 0) + vote.rshares

          const votesValue =
            Converter.calculateVshares(currentActiveRshares) /
            recent_claims *
            reward_balance *
            base

          result = (
            (post.total_payout_value + votesValue) *
            CURRENCY_Q
          ).toFixed(2)
        }

      } else {
        const setVoteMode = (time, post) => {
          if (post.mode === MODES.FIRST_PAYOUT)
            return MODES.FIRST_PAYOUT

          if (post.mode === MODES.SECOND_PAYOUT)
            return time <= moment(post.last_payout).unix()
              ? MODES.FIRST_PAYOUT
              : MODES.SECOND_PAYOUT

          if (post.mode === MODES.ARCHIVED)
            return time <= moment(post.last_payout).subtract(30, 'days').unix()
              ? MODES.FIRST_PAYOUT
              : MODES.SECOND_PAYOUT
        }

        vote.mode = setVoteMode(time, post)

        let activeRshares = active_votes.reduce((sum, _vote) => {
          const _time = moment(_vote.time + '+00:00').unix()
          _vote.mode = setVoteMode(_time, post)
          if (_vote.mode === vote.mode) {
            sum += +_vote.rshares
          }
          return sum
        }, 0)

        let q = (reward_balance * base) / recent_claims
        let vShares = Converter.calculateVshares(activeRshares)
        if (vote.mode !== post.mode || post.mode === MODES.SECOND_PAYOUT) {
          if (post.mode === MODES.SECOND_PAYOUT) {
            if (vote.mode === MODES.SECOND_PAYOUT)
              q = post.pending_payout_value / vShares
            else
              q = post.total_payout_value / vShares
          } else {
            if (post.separatePayots[vote.mode]) {
              let sbd_payout = 2 * parseFloat(post.separatePayots[vote.mode].sbd_payout.split(' ')[0])
              if (!sbd_payout && vShares && !post.percent_steem_dollars) {
                sbd_payout = post.total_payout_value
              }
              q = sbd_payout / vShares
            } else {
              // @todo Need show error or stub, because calc not found separate payout
              let activeRshares = active_votes.reduce((sum, _vote) => {
                sum += +_vote.rshares
                return sum
              }, 0)
              let vShares = Converter.calculateVshares(activeRshares)
              q = post.total_payout_value / vShares
            }
          }
        }
        const votesValue = vShares * q
        const percentRshares = vote.rshares / (activeRshares / 100)
        result = (((votesValue / 100) * percentRshares) * CURRENCY_Q).toFixed(2)
      }
    }

    return result
  }
}

export default Converter