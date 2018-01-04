<template>
  <section class="main-content">
    <section class="post-page__wrapper">
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
import PostView from '../../components/chains/PostView.vue'
import CommentsWrapper from '../../components/chains/CommentsWrapper.vue'

export default {
  name: 'Post',
  components: {
    PostView,
    CommentsWrapper
  },
  asyncData({ store, route, router }) {
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
  },
  beforeDestroy() {
    this.$store.commit('setPostViewData', null)
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
