<template>
  <div class="post-view__comments-wrapper">
      <comment-form @success="addComment" :special="true" :post="post" v-if="account.username"></comment-form>
      <h2 class="h2 post-view__comments-title">{{$t('comment.header')}}</h2>
      <div class="comments__spinner" v-if="repliesProcessing"><img src="/static/img/spinner.gif" alt="spin"></div>
      <section class="post-view__comments">
        <comment v-for="item in replies" :account="account" :item="item" :key="item.permlink" :level="1"></comment>
      </section>
  </div>
</template>

<script>
import Comment from './Comment.vue'
import CommentForm from './CommentForm.vue'

export default {
  name: 'CommentsWrapper',
  components: {
    Comment,
    CommentForm
  },
  props: ['post'],
  computed: {
    replies() {
      return this.$store.state.postView.replies || []
    },
    repliesProcessing() {
      return this.$store.state.postView.repliesProcessing
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    },
    accountsByChain() {
      return this.accounts.filter(acc => acc.chain === this.chain)
    },
    accounts() {
      return this.$auth && this.$auth.check() ? this.$auth.user().accounts : []
    },
    account() {
      let result = { avatar: '/static/img/avatar.svg', username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    }
  },
  methods: {
    addComment(comment) {
      this.$store.commit('addPostViewReplie', comment)
    }
  },
  beforeMount() {
    this.$store.dispatch('fetchRepliesByPermlink', {
      chain: this.$route.params.chain,
      username: this.post.author,
      permlink: this.post.permlink
    })
  }
}
</script>
