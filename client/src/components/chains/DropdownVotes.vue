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
      const locale =
        this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ? 'en' : 'ru'
      const params = this.$store.state.core.params[this.chain]
      return this.$n(
        Converter.voteToFiat(vote, this.chain, params, this.post, false),
        'currency',
        locale
      )
    }
  },
  computed: {
    sortAndSliceVotes() {
      return this.post.active_votes.slice(0, MAX_COUNT_VOTES)
    },
    countMore() {
      return this.post.active_votes.length - MAX_COUNT_VOTES
    }
  }
}
</script>

<template>
  <no-ssr>
    <div class="dropdown post-view__voters">
      <ul class="post-view__voter-list">
        <li class="post-view__voter" v-for="vote in sortAndSliceVotes" :key="vote.voter">
          <a :href="`/${chain}/@${vote.voter}`" class="post-view__voter-name link">{{vote.voter}}</a>
          <span class="post-view__voter-amount currency">{{calcFiat(vote)}}</span>
        </li>
      </ul>
      <span class="post-view__voters-all" v-if="countMore > 0">and {{countMore}} more...</span>
    </div>
  </no-ssr>
</template>
