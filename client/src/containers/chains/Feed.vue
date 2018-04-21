<template>
  <section class="main-content">
    <section class="feed container">
    
      <div class="blog__header" id="blog__header">
        <div class="blog__header-tab blog__header-tab--active">{{$t('feed.following')}}</div>
        <!-- <div class="blog__header-tab">Recommended</div> -->
      </div>
    
      <div class="feed__wrapper">
        <feed-posts></feed-posts>
        <aside class="feed__aside">
          <feed-filter-by-tags></feed-filter-by-tags>
        </aside>
      </div>
    </section>
  </section>
</template>
<script>
import FeedPosts from '../../components/chains/feed/FeedPosts.vue'
import FeedFilterByTags from '../../components/chains/feed/FeedFilterByTags.vue'

export default {
  name: 'Feed',
  asyncData({ store, route, router }) {
    if (!store.state.feed.posts.collection.length) {
      return store
        .dispatch('feed/fetchState', {
          chain: route.params.chain,
          username: route.params.username
        })
        .catch(err => {
          if (
            (err && ~[500, 404].indexOf(err.status)) ||
            (err.response && ~[500, 404].indexOf(err.response.status))
          ) {
            store.commit('set404Page', true)
          }
        })
    } else return Promise.resolve()
  },
  components: {
    FeedPosts,
    FeedFilterByTags
  },
  destroyed() {
    this.$store.commit('feed/CLEAR_ALL_DATA')
  },
  watch: {
    $route(to, from) {
      this.$store.commit('feed/CLEAR_ALL_DATA')
      this.$options.asyncData({
        store: this.$store,
        route: this.$route,
        router: this.$router
      })
    }
  },
  metaInfo() {
    return this.$metaGenerator.feed(this.$route)
  }
}
</script>
