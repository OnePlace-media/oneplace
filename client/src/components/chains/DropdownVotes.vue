<script>
const MAX_COUNT_VOTES = 10
const sortByRshares = (a, b) => +b.rshares - +a.rshares

export default {
  name: 'DropdownVotes',
  props: ['post', 'chain'],
  created() {
    this.post.active_votes.sort(sortByRshares)
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
  <div class="dropdown post-view__voters">
    <ul class="post-view__voter-list">
      <li class="post-view__voter" v-for="vote in sortAndSliceVotes" :key="vote.voter">
        <a href="#" class="post-view__voter-name link">{{vote.voter}}</a>
        <span class="post-view__voter-amount currency">{{vote.rshares}}</span>
      </li>
    </ul>
    <span class="post-view__voters-all" v-if="countMore > 0">and {{countMore}} more...</span>
  </div>
</template>
