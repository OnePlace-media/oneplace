<script>
import moment from 'moment'
import Converter from '@oneplace/blockchains-api/converter'
const CONSTANTS = require('@oneplace/constants')

const MAX_COUNT_VOTES = 20
const NEED_COUNT_VOTES = 10

const sortByRshares = isDislike => {
  return (a, b) => isDislike 
    ? +a.rshares - +b.rshares
    : +b.rshares - +a.rshares
}

const sortByFiat = isDislike => {
  return (a, b) => isDislike 
    ? a.fiat.number - b.fiat.number
    : b.fiat.number - a.fiat.number
}

export default {
  name: 'DropdownVotes',
  props: {
    post: {
      type: Object,
      required: true
    },
    chain: {
      type: String,
      default() {
        return this.$router.params.chain
      }
    },
    isDislike:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    calcFiat(vote) {
      let locale = 'ru'
      let prefix = ''
      let postfix = ''

      if (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM) {
        locale = 'en'
        postfix = ' $'
      }

      const params = this.$store.state.core.params[this.chain]
      let payout = Converter.voteToFiat(
        vote,
        this.chain,
        params,
        this.post,
        false
      )
      if (payout === '0.00') {
        payout = '0.01'
        prefix = '< '
      }

      return {
        isZero: !!prefix || payout == 0,
        number: +payout,
        string:
          prefix +
          this.$n(payout, 'currency', locale).replace('$', '') +
          postfix
      }
    }
  },
  computed: {
    activeVotesLike() {
      const active_votes = this.post.active_votes.filter(
        vote => this.isDislike 
          ? vote.weight < 0 || vote.percent < 0
          : vote.weight > 0 || vote.percent > 0
      )
      active_votes.sort(sortByRshares(this.isDislike))
      return active_votes
    },
    sortAndSliceVotes() {
      return this.activeVotesLike.slice(0, MAX_COUNT_VOTES)
    },
    votesWithFiatAndResort() {
      const sortAndSliceVotes = [...this.sortAndSliceVotes].map(vote => {
        vote.fiat = this.calcFiat(vote)
        return vote
      })
      sortAndSliceVotes.sort(sortByFiat(this.isDislike))
      return sortAndSliceVotes.slice(0, NEED_COUNT_VOTES)
    },
    sum(){
      const sortAndSliceVotes = [...this.activeVotesLike].map(vote => {
        vote.fiat = this.calcFiat(vote)
        return vote
      })
      return sortAndSliceVotes.reduce((sum, vote)=> {sum += vote.fiat.number; return sum}, 0)
    },
    count() {
      return this.activeVotesLike.length - NEED_COUNT_VOTES
    },
    hideFiat(){
      return this.post.mode === 'archived' && moment(this.post.last_payout).unix() < moment('2018-04-01', 'YYYY-MM-DD').unix()
    }
  }
}
</script>

<template>
  <no-ssr>
    <div class="dropdown post-view__voters">
      <ul class="post-view__voter-list">
        <li class="post-view__voter" v-for="vote in votesWithFiatAndResort" :key="vote.voter">
          <router-link tag="a" :to="{name:'chain-account-view', params:{chain, username:vote.voter}}" class="link">
            {{vote.voter}}
          </router-link>
          <span class="post-view__voter-amount currency" v-if="!isDislike && !hideFiat && !vote.fiat.isZero">{{vote.fiat.string}}</span>
        </li>
      </ul>
      <span class="post-view__voters-all" v-if="count > 0">{{$t('chains.andMore', {count})}}</span>
    </div>
  </no-ssr>
</template>
