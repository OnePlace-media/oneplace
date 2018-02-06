<script>
const MAX_COUNT_VOTES = 10
const sortByRshares = (a, b) => +b.rshares - +a.rshares
import Converter from '@oneplace/blockchains-api/converter'
const CONSTANTS = require('@oneplace/constants')

export default {
  name: 'DropdownVotes',
  props: ['post', 'chain'],
  created() {
    this.post.active_votes.sort(sortByRshares)
  },
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
      return this.post.active_votes.filter(
        vote => vote.weight > 0 || vote.percent > 0
      )
    },
    sortAndSliceVotes() {
      return this.activeVotesLike.slice(0, MAX_COUNT_VOTES)
    },
    count() {
      return this.activeVotesLike.length - MAX_COUNT_VOTES
    }
  }
}
</script>

<template>
  <no-ssr>
    <div class="dropdown post-view__voters">
      <ul class="post-view__voter-list">
        <li class="post-view__voter" v-for="vote in sortAndSliceVotes" :key="vote.voter">
          <router-link tag="a" :to="{name:'chain-account-view', params:{chain, username:vote.voter}}" class="link link--op">
            {{vote.voter}}
          </router-link>
          <span class="post-view__voter-amount currency">{{calcFiat(vote)}}</span>
        </li>
      </ul>
      <span class="post-view__voters-all" v-if="count > 0">{{$t('chains.andMore', {count})}}</span>
    </div>
  </no-ssr>
</template>
