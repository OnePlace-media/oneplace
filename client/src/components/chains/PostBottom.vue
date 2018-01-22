<template>
  <div :class="{'post-view__post-data':!isComment, 'comment__post-data': isComment}" >
    <span class="post-view__post-data-item" :class="{'post-view__post-value-correction': showPayoutWithVote}">
      <span class="post-view__post-currency" :class="{'payout-declined': post.payout_declined}">{{currencySymbol}}</span>
      <span class="post-view__post-value">{{payoutValue}}
        <dropdown-payout :post="post" :chain="chain" v-if="!isComment"></dropdown-payout>
      </span>
    </span>
    <span class="post-view__post-data-item">
      <a 
        @click.prevent
        class="post-view__post-like" 
        @mouseout="voteIsSliding=false"
        @mouseover="voteIsSliding=true"
        :title="isLike ? $t('comment.removeVote') : $t('comment.like')"
        :class="{'post-view__post-like--active': isLike}">
        <svg 
          @click.prevent="$emit('vote', true, voteWeight)" 
          class="post-view__icon post-view__icon-like post-view__icon--disabled"
          :class="{'post-view__icon--small': isComment}"
        >
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#like"></use>
        </svg>
        <slider v-if="voteSliderActive && !isLike" :value.sync="voteWeight"></slider>
      </a>
      <span class="post-view__votes">{{likeVotes}}
        <dropdown-votes :post="post" :chain="chain" v-if="!isComment"></dropdown-votes>
      </span>
    </span>
    <span class="post-view__post-data-item" v-if="isComment">
      <a 
        @click.prevent="vote(false)"
        class="post-view__post-like" 
        :class="{'post-view__post-like--active': isDislike}" 
        :title="isDislike ? $t('comment.removeVote') : $t('comment.dislike')">
        <svg class="post-view__icon post-view__icon--small post-view__icon-dislike">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#like"></use>
        </svg>
      </a>{{dislikeVotes}}
    </span>
    <span class="post-view__post-data-item" v-if="!isComment">
      <a class="post-view__post-reply" :title="$t('common.reply')" @click="focusToComment" v-scroll-to="'#comment-input-root'">
        <svg class="post-view__icon post-view__icon-comment">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#comment"></use>
        </svg>
      </a>{{post.children}}
    </span>
    <a href="#"
      v-if="isComment && !isMaxDeep && account.username"
        class="post-view__post-data-item link" 
      :title="$t('common.reply')"
      v-scroll-to="`#comment-input-${post.permlink}`"
      @click.prevent="$emit('reply')">{{$t('common.reply')}}
    </a>
  </div>
</template>

<script>
import Slider from './Slider.vue'
import CONSTANTS from '@oneplace/constants'
import moment from 'moment'
import DropdownPayout from './DropdownPayout.vue'
import DropdownVotes from './DropdownVotes.vue'

const CONSTANT_S = 2000000000000
const STEEMIT_VOTE_REGENERATION_SECONDS = 5 * 60 * 60 * 24
const STEEM_100_PERCENT = 10000

export default {
  name: 'PostBottom',
  props: [
    'post',
    'account',
    'chain',
    'type',
    'isMaxDeep'
  ],
  data() {
    return {
      voteIsSliding: false,
      voteWeight: 10000
    }
  },
  components: {
    Slider,
    DropdownPayout,
    DropdownVotes
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
    isLike() {
      return this.account.username
        ? !!this.post.active_votes.find(
            vote =>
              vote.voter === this.account.username &&
              (vote.percent > 0 || vote.weight > 0)
          )
        : false
    },
    isDislike() {
      return this.account.username
        ? !!this.post.active_votes.find(
            vote =>
              vote.voter === this.account.username &&
              (vote.percent < 0 || vote.weight < 0)
          )
        : false
    },
    likeVotes() {
      return this.post.active_votes.filter(
        vote => +vote.weight > 0 || +vote.percent > 0
      ).length
    },
    dislikeVotes() {
      return this.post.active_votes.filter(
        vote => +vote.weight < 0 || +vote.percent < 0
      ).length
    },
    isComment() {
      return this.type === 'comment'
    },
    payoutValue() {
      const locale =
        this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ? 'en' : 'ru'
      return this.showPayoutWithVote
        ? this.diffPayouts
        : this.$n(this.post.payout, 'currency', locale).replace(/( ₽)|\$/, '')
    },
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
      const params = this.$store.state.core.params[this.chain]
      const VOTE_POWER_REVERSE_RATE =
        params.globalProps.vote_power_reserve_rate || 40
      const CURRENCY = {
        [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: 1,
        [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: this.$store.state.core.params[
          CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
        ].goldPrice
      }

      const calculateVshares = rshares => {
        return Math.pow(rshares + CONSTANT_S, 2) - Math.pow(CONSTANT_S, 2)
      }

      const { recent_claims, reward_balance } = params.rewardFunds

      const data = this.account.data

      const voting_power = data.voting_power
      let total_vests = parseFloat(data.vesting_shares.split(' ')[0])

      if (data.received_vesting_shares)
        total_vests += parseFloat(data.received_vesting_shares.split(' ')[0])

      if (data.delegated_vesting_shares)
        total_vests -= parseFloat(data.delegated_vesting_shares.split(' ')[0])

      const vote_pct = this.voteWeight
      const max_vote_denom =
        VOTE_POWER_REVERSE_RATE *
        STEEMIT_VOTE_REGENERATION_SECONDS /
        (60 * 60 * 24)
      let used_power = voting_power * vote_pct / STEEM_100_PERCENT
      used_power = (used_power + max_vote_denom - 1) / max_vote_denom

      let rshares = total_vests * used_power / STEEM_100_PERCENT
      rshares = Math.floor(rshares * 1000000)

      const base =
        parseFloat(params.feedPrice.base.split(' ')[0]) /
        parseFloat(params.feedPrice.quote.split(' ')[0])

      if (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM) {
        const voteValue = rshares / recent_claims * reward_balance * base
        return (+this.post.payout + voteValue).toFixed(2)
      } else {
        const lastPayout = moment(this.post.last_payout).unix()
        const created = moment(this.post.created).unix()
        const activeRshares =
          this.post.active_votes.reduce((sum, vote) => {
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
