<template>
  <div class="feed__posts">
    <feed-article 
      v-for="post in posts" 
      :key="post.id" 
      :post="post">
    </feed-article>
    <no-ssr>
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
  computed: {
    posts() {
      return this.$store.state.feed.posts.collection
    },
    postsProcessing() {
      return this.$store.state.feed.posts.processing
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.postsProcessing) {
        this.$store
          .dispatch('feed/appendPosts', {
            chain: this.chain,
            username: this.$route.params.username,
            limit: LIMIT
          })
          .then(posts => {
            $state.loaded()
            if (posts.length < LIMIT) {
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
    }
  }
}
</script>
