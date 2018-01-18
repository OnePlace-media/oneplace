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
      return this.voteIsSliding && !this.isLike && this.account.username // && this.payoutWithVote !== this.post.payout
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
      const CURRENCY = {
        [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: 1,
        [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: this.$store.state.params[
          CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
        ].goldPrice
      }
      const steem_per_mvests = this.$store.state.params[this.chain]
        .steem_per_mvests

      const vestsToSp = vests => {
        return vests / 1e6 * steem_per_mvests
      }

      const spToVests = sp => {
        return sp * 1e6 / steem_per_mvests
      }

      const vestsToRshares = (sp, voting_power = 10000, vote_pct = 10000) => {
        const vesting_shares = parseInt(spToVests(sp) * 1e6, 10)
        const power = voting_power * vote_pct / 10000 / 200 + 1
        return power * vesting_shares / 10000
      }

      const calculateVshares = rshares => {
        return (
          (rshares + CONSTANT_S) * (rshares + CONSTANT_S) -
          CONSTANT_S * CONSTANT_S
        )
      }

      const data = this.account.data
      const { recent_claims, reward_balance } = this.$store.state.params[
        this.chain
      ].rewardFunds

      const voting_power = data.voting_power
      let total_vests = parseFloat(data.vesting_shares.split(' ')[0])

      if (data.received_vesting_shares)
        total_vests += parseFloat(data.received_vesting_shares.split(' ')[0])

      if (data.delegated_vesting_shares)
        total_vests -= parseFloat(data.delegated_vesting_shares.split(' ')[0])

      const sp = vestsToSp(total_vests)
      const vote_pct = this.voteWeight
      const rshares = vestsToRshares(sp, voting_power, vote_pct)
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
