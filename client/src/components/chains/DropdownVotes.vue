<script>
const MAX_COUNT_VOTES = 20
const NEED_COUNT_VOTES = 10
const fiatToNumber = f => +f.replace('< ', '').replace(',', '.').split(' ')[0]
const sortByRshares = (a, b) => +b.rshares - +a.rshares
const sortByFiat = (a, b) => {
  const aFiat = fiatToNumber(a.fiat)
  const bFiat = fiatToNumber(b.fiat)
  return bFiat - aFiat
}
import Converter from '@oneplace/blockchains-api/converter'
const CONSTANTS = require('@oneplace/constants')

export default {
  name: 'DropdownVotes',
  props: ['post', 'chain'],
  methods: {
    calcFiat(vote) {
      let locale = 'ru'
      let prefix = ''
      let postfix = ''

      if (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM) {
        locale = 'en'
        postfix = ' $'
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
      return (
        prefix + this.$n(payout, 'currency', locale).replace('$', '') + postfix
      )
    }
  },
  computed: {
    activeVotesLike() {
      const active_votes = this.post.active_votes.filter(vote => vote.weight > 0 || vote.percent > 0)
      active_votes.sort(sortByRshares)
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
      sortAndSliceVotes.sort(sortByFiat)
      return sortAndSliceVotes.slice(0, NEED_COUNT_VOTES)
    },
    count() {
      return this.activeVotesLike.length - NEED_COUNT_VOTES
    }
  }
}
</script>

<template>
  <no-ssr>
    <div class="dropdown post-view__voters">
      <ul class="post-view__voter-list">
        <li class="post-view__voter" v-for="vote in votesWithFiatAndResort" :key="vote.voter">
          <router-link tag="a" :to="{name:'chain-account-view', params:{chain, username:vote.voter}}" class="link link--op">
            {{vote.voter}}
          </router-link>
          <span class="post-view__voter-amount currency">{{vote.fiat}}</span>
        </li>
      </ul>
      <span class="post-view__voters-all" v-if="count > 0">{{$t('chains.andMore', {count})}}</span>
    </div>
  </no-ssr>
</template>
