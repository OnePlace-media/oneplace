<template>
  <section class="main-content">
    <section class="feed container">
    
      <div class="blog__header" id="blog__header">
        <div class="blog__header-tab blog__header-tab--active">{{$t('feed.following')}}</div>
        <!-- <div class="blog__header-tab">Recommended</div> -->
      </div>
    
      <div class="feed__wrapper">
        <feed-posts></feed-posts>
        <aside>
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
      return store.dispatch('feed/fetchState', {
        chain: route.params.chain,
        username: route.params.username
      })
    } else return Promise.resolve()
  },
  components: {
    FeedPosts,
    FeedFilterByTags
  }
}
</script>
