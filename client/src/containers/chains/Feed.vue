<template>
  <section class="main-content">
    <section class="feed container">
      <no-ssr>
        <center>
          <pulse-loader :loading="!firstFetched" :color="'#383838'" :size="'10px'"></pulse-loader>
        </center>
      </no-ssr>

      <div class="blog__header" id="blog__header" v-show="firstFetched">
        <div class="blog__header-tab blog__header-tab--active">{{$t('feed.following')}}</div>
        <!-- <div class="blog__header-tab">Recommended</div> -->
      </div>

      <div class="feed__wrapper" v-show="firstFetched">
        <feed-posts></feed-posts>
        <aside class="feed__aside">
          <feed-filter-by-tags :tags="tags"></feed-filter-by-tags>
          <filter-by-tags-modal v-if="filterByTagsShow" :tags="tags" @change="change"></filter-by-tags-modal>
        </aside>
      </div>
    </section>
  </section>
</template>
<script>
import FeedPosts from '../../components/chains/feed/FeedPosts.vue'
import FeedFilterByTags from '../../components/chains/feed/FeedFilterByTags.vue'
import FilterByTagsModal from '../../components/chains/common/FilterByTagsModal.vue'
const parser = require('@oneplace/blockchains-api/parser')
import EventBus from '../../event-bus'

export default {
  name: 'Feed',
  asyncData({ store, route, router }) {
    if (!store.state.feed.posts.collection.length) {
      store.commit('filterByTags/CLEAR_ALL_DATA')
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
  computed: {
    filterByTagsShow() {
      return this.$store.state.filterByTags.modalShow
    },
    firstFetched() {
      return this.$store.state.feed.posts.firstFetched
    },
    tags() {
      const posts = this.$store.state.feed.posts.collection
      const tags = parser.getTagsFromPosts(posts)
      tags.sort((a, b) => b.count - a.count)
      return tags
    }
  },
  methods: {
    change({ include, exclude }) {
      EventBus.$emit('FEED:FILTER:CHANGE', { include, exclude })
    }
  },
  components: {
    FeedPosts,
    FeedFilterByTags,
    FilterByTagsModal
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
