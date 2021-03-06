<template>
  <div class="feed__posts">
    <div class="feed__no-posts" v-show="!posts.length && !postsProcessing">
      {{$t('feed.noPostsMessage', {username: $route.params.username})}}
    </div>
    
    <feed-article 
      v-for="post in posts" 
      :key="post.id" 
      :post="post">
    </feed-article>
    <no-ssr v-if="posts.length">
      <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading">
        <center slot="spinner">
          <br><pulse-loader :color="'#383838'" :size="'10px'"></pulse-loader><br>
        </center>
        <span slot="no-more"></span>
      </infinite-loading>
    </no-ssr>
  </div>
</template>


<script>
import FeedArticle from './FeedArticle.vue'
import InfiniteLoading from 'vue-infinite-loading'
import EventBus from '../../../event-bus'
const LIMIT = 15
export default {
  name: 'FeedPosts',
  components: {
    FeedArticle,
    InfiniteLoading
  },
  props: {
    chain: {
      type: String,
      default() {
        return this.$route.params.chain
      }
    }
  },
  data() {
    return {
      complete: false,
      include: {},
      exclude: {}
    }
  },
  mounted() {
    this.$store.dispatch('core/fetchParams', {
      chain: this.chain,
      $chains: this.$chains
    })

    EventBus.$on('FEED:FILTER:CHANGE', this.handlerFilterChange)
    EventBus.$on('POST:UPDATE', this.handlerPostUpdate)
  },
  destroyed() {
    EventBus.$off('FEED:FILTER:CHANGE', this.handlerFilterChange)
    EventBus.$off('POST:UPDATE', this.handlerPostUpdate)
  },
  computed: {
    postsWithoutFilters() {
      return this.$store.state.feed.posts.collection
    },
    posts() {
      const posts = this.postsWithoutFilters
      const include = this.include
      const exclude = this.exclude

      const postsFilter = this.$helper.filterPostByTags({
        posts,
        include,
        exclude
      })

      if (postsFilter.length < LIMIT && !this.complete) {
        this.$nextTick(() => {
          if (this.$refs.infiniteLoading) {
            this.$refs.infiniteLoading.attemptLoad()
          }
        })
      }

      return postsFilter
    },
    postsProcessing() {
      return this.$store.state.feed.posts.processing
    }
  },
  methods: {
    handlerPostUpdate({ post }) {
      this.$store.commit('feed/UPDATE_POST', {post})
    },
    handlerFilterChange({ include, exclude }) {
      this.include = include
      this.exclude = exclude
    },
    infiniteHandler($state) {
      if (!this.postsProcessing) {
        if (this.posts.length) {
          this.$store
            .dispatch('feed/appendPosts', {
              chain: this.chain,
              username: this.$route.params.username,
              limit: LIMIT
            })
            .then(posts => {
              $state.loaded()
              if (posts.length < LIMIT - 1) {
                $state.complete()
                this.complete = true
              }
            })
            .catch(err => {
              $state.loaded()
              $state.complete()
              this.complete = true
              this.$toast.bottom(this.$t(`errors.FAILED_APPEND_POST_BY_AUTHOR`))
            })
        } else setTimeout($state.loaded, 2000)
      } else {
        $state.loaded()
        $state.complete()
        this.complete = true
      }
    }
  }
}
</script>
