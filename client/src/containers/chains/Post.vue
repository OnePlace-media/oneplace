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
import { mapGetters } from 'vuex'

export default {
  name: 'Post',
  components: {
    PostView,
    CommentsWrapper
  },
  metaInfo() {
    return {
      title: this.processing ? 'Loading...' : this.post.title,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.post.preview
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: this.post.title + ' | OnePlace.media'
        },
        { vmid: 'og:type', property: 'og:type', content: 'article' },
        {
          vmid: 'article:tag',
          property: 'article:tag',
          content: this.post.category
        },
        {
          vmid: 'article:published_time',
          property: 'article:published_time',
          content: this.post.created
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: `https://oneplace.media${this.$route.path}`
        },
        { vmid: 'og:image', property: 'og:image', content: this.post.image },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: this.post.preview
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'OnePlace.media'
        }
      ]
    }
  },
  created() {
    if (!this.post) {
      this.$options.asyncData({
        store: this.$store,
        route: this.$route
      })
    }
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
    ...mapGetters({
      post: 'post',
      processing: 'postIsLoading'
    })
  }
}
</script>
