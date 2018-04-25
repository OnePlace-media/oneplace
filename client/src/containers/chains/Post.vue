<template>
  <section class="main-content">
    <section class="post-page__wrapper">
      <post-share></post-share>
      <div class="container">
        <center><pulse-loader :loading="!post" :color="'#383838'" :size="'10px'"></pulse-loader></center>
        <post-view v-if="post" :is-modal="false"></post-view>
      </div>
    </section>
    <div class="container"  v-if="post">
      <no-ssr>
        <comments-wrapper :post="post"></comments-wrapper>
      </no-ssr>
    </div>
  </section>
</template>

<script>
import PostView from '../../components/chains/post/PostView.vue'
import CommentsWrapper from '../../components/chains/comment/CommentsWrapper.vue'
import PostShare from '../../components/chains/post/PostShare.vue'

export default {
  name: 'Post',
  components: {
    PostView,
    CommentsWrapper,
    PostShare
  },
  asyncData({ store, route, router }) {
    if (
      !store.state.postView.post ||
      store.state.postView.post.permlink !== route.params.permlink
    ) {
      return store
        .dispatch('fetchPostByPermlink', {
          chain: route.params.chain,
          username: route.params.username,
          permlink: route.params.permlink
        })
        .catch(err => {
          if (err.response.status === 500) {
            store.commit('set404Page', true)
          }
        })
    } else {
      return new Promise(resolve => resolve())
    }
  },
  beforeDestroy() {
    this.$store.commit('setPostViewData', null)
  },
  mounted() {
    if (!this.post) {
      this.$options.asyncData({
        store: this.$store,
        route: this.$route,
        router: this.$router
      })
    }
  },
  computed: {
    post() {
      return this.$store.state.postView.post
    },
    processing() {
      return this.$store.state.postView.processing
    }
  }
}
</script>
