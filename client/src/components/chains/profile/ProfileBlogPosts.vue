<template>
  <div>
    <div class="blog__no-posts" v-if="!posts.length">
      {{$t(`profile.${messageOfEmptyPosts}`)}}
    </div>
    <profile-blog-article
      v-for="post in posts" :key="post.id"
      :post="post"
      :account="account"
      :accountCurrent="accountCurrent"
      :chain="chain"
      @show="post=>$emit('show', post)"
      @focus="post=>$emit('focus', post)"
    ></profile-blog-article>
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
import CONSTANTS from '@oneplace/constants'
import ProfileBlogArticle from './ProfileBlogArticle.vue'
import InfiniteLoading from 'vue-infinite-loading'
import EventBus from '../../../event-bus'
const LIMIT = 5

export default {
  name: 'ProfileBlogPosts',
  components: {
    ProfileBlogArticle,
    InfiniteLoading
  },
  props: {
    account: {
      type: Object,
      required: true
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
    EventBus.$on('PROFILE:FILTER:CHANGE', ({ include, exclude }) => {
      this.include = include
      this.exclude = exclude
    })
  },
  methods: {
    infiniteHandler($state) {
      const posts = this.$store.state.profile.posts.collection

      if (!this.postsProcessing) {
        let lastPost = (lastPost = posts[posts.length - 1])
        this.$store
          .dispatch('profile/fetchPostByBlog', {
            chain: this.chain,
            tag: this.$route.params.username,
            start_author: lastPost.author,
            start_permlink: lastPost.permlink,
            limit: LIMIT + 1
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
  },
  computed: {
    messageOfEmptyPosts() {
      return this.postsWithoutFilters.length
        ? 'emptyBlogByFilters'
        : 'emptyBlog'
    },
    accountsByChain() {
      return this.accounts.filter(acc => acc.chain === this.chain)
    },
    accounts() {
      return this.$auth && this.$auth.check() ? this.$auth.user().accounts : []
    },
    accountCurrent() {
      let result = { avatar: CONSTANTS.DEFAULT.AVATAR_IMAGE, username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    },
    postsWithoutFilters() {
      return this.$store.state.profile.posts.collection
    },
    postsWithoutRepost() {
      return this.$store.state.profile.postsAuthor.collection
    },
    posts() {
      const posts = this.postsWithoutFilters
      let postsFilter = posts.filter(post => {
        let result = true
        const include = this.include
        const exclude = this.exclude
        if (Object.keys(include).length && Object.keys(exclude).length)
          result =
            post.tags.every(tag => !exclude[tag]) &&
            post.tags.some(tag => include[tag])
        else if (Object.keys(include).length)
          result = post.tags.some(tag => include[tag])
        else if (Object.keys(exclude).length)
          result = post.tags.every(tag => !exclude[tag])
        return result
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
      return this.$store.state.profile.posts.processing
    }
  }
}
</script>
