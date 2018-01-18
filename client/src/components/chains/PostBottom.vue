<template>
  <div class="post-view__post-info post-view__post-info--bottom" v-show="!$store.state.params[chain].processing">
    <div class="post-view__post-data">
      <span class="post-view__post-data-item" :class="{'post-view__post-value-correction': showPayoutWithVote}">
        <span class="post-view__post-currency" :class="{'payout-declined': post.payout_declined}">{{currencySymbol}}</span>
        {{showPayoutWithVote ? diffPayouts : post.payout}}
      </span>
      <span class="post-view__post-data-item">
        <a 
          @click.prevent
          class="post-view__post-like" 
          @mouseout="voteIsSliding=false"
          @mouseover="voteIsSliding=true"
          :title="isLike ? $t('comment.removeVote') : $t('comment.like')"
          :class="{'post-view__post-like--active': isLike}">
          <svg @click.prevent="$emit('vote', true, voteWeight)" class="post-view__icon post-view__icon-like post-view__icon--disabled">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#like"></use>
          </svg>
          <slider v-if="voteSliderActive && !isLike" :value.sync="voteWeight">
          </slider>
        </a>{{likeVotes}}
      </span>
      <span class="post-view__post-data-item">
        <a class="post-view__post-reply" :title="$t('common.reply')" @click="focusToComment" v-scroll-to="'#comment-input-root'">
          <svg class="post-view__icon post-view__icon-comment">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#comment"></use>
          </svg>
        </a>{{post.children}}
      </span>
    </div>
  </div>
</template>

<script>
import Slider from './Slider.vue'
import CONSTANTS from '@oneplace/constants'
import moment from 'moment'
export default {
  name: 'PostBottom',
  props: [
    'post',
    'account',
    'chain',
    'likeVotes',
    'isLike',
    'isDislike',
    'dislikeVotes'
  ],
  data() {
    return {
      voteIsSliding: false,
      voteWeight: 10000
    }
  },
  components: {
    Slider
  },
  methods: {
    slide(value) {
      this.$store.commit('setVoteWeight', value)
    },
    focusToComment() {
      const commentInputRoot = document.getElementById('comment-input-root')
      if (commentInputRoot) commentInputRoot.focus()
    }
  },
  computed: {
    showPayoutWithVote() {
      return (
        this.voteIsSliding &&
        !this.isLike &&
        this.account.username &&
        this.payoutWithVote !== this.post.payout
      )
    },
    voteSliderActive() {
      return (
        this.account.username &&
        +this.account.data.vesting_shares.split(' ')[0] > 1e6
      )
    },
    currencySymbol() {
      return this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS ? '₽' : '$'
    },
    diffPayouts() {
      let diff = (this.payoutWithVote - this.post.payout).toFixed(2)
      if (diff > 0) diff = '+' + diff
      return diff
    },
    payoutWithVote() {
      const CONSTANT_S = 2000000000000
      const STEEMIT_VOTE_REGENERATION_SECONDS = 5 * 60 * 60 * 24
      const STEEM_100_PERCENT = 10000
      const VOTE_POWER_REVERSE_RATE = this.$store.state.params[this.chain].globalProps.vote_power_reserve_rate || 40
      const CURRENCY = {
        [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: 1,
        [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: this.$store.state.params[
          CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
        ].goldPrice
      }
      const steem_per_mvests = this.$store.state.params[this.chain].steem_per_mvests

      const calculateVshares = rshares => {
        return (Math.pow(rshares + CONSTANT_S, 2) - Math.pow(CONSTANT_S, 2))
      }

      const { recent_claims, reward_balance } = this.$store.state.params[
        this.chain
      ].rewardFunds

      const data = this.account.data
      
      const voting_power = data.voting_power
      let total_vests = parseFloat(data.vesting_shares.split(' ')[0])

      if (data.received_vesting_shares)
        total_vests += parseFloat(data.received_vesting_shares.split(' ')[0])

      if (data.delegated_vesting_shares)
        total_vests -= parseFloat(data.delegated_vesting_shares.split(' ')[0])

      const vote_pct = this.voteWeight


      const max_vote_denom = VOTE_POWER_REVERSE_RATE * STEEMIT_VOTE_REGENERATION_SECONDS / (60*60*24)
      let used_power = (voting_power * vote_pct) / STEEM_100_PERCENT
      used_power = (used_power + max_vote_denom - 1) / max_vote_denom

      let rshares = total_vests * used_power / STEEM_100_PERCENT
      rshares = Math.floor(rshares * 1000000)
      const feedPrice = this.$store.state.params[this.chain].feedPrice
      const base =
        parseFloat(feedPrice.base.split(' ')[0]) /
        parseFloat(feedPrice.quote.split(' ')[0])

      if (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM) {
        const voteValue = rshares / recent_claims * reward_balance * base
        return (+this.post.payout + voteValue).toFixed(2)
      } else {
        const lastPayout = moment(this.post.last_payout).unix()
        const created = moment(this.post.created).unix()

        const activeRshares =
          this.post.votes.reduce((sum, vote) => {
            const time = moment(vote.time + '+00:00').unix()
            if (lastPayout < created || time > lastPayout) {
              sum += +vote.rshares
            }
            return sum
          }, 0) + rshares

        const votesValue =
          calculateVshares(activeRshares) /
          recent_claims *
          reward_balance *
          base

        return (
          (this.post.total_payout_value + votesValue) *
          CURRENCY[this.chain]
        ).toFixed(2)
      }
    }
  }
}
</script>
