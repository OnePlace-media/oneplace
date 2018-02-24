<template>
  <div>
    <div class="blog__no-posts" v-if="!posts.length">
      {{$t(`profile.${messageOfEmptyPosts}`)}}
    </div>
    <profile-blog-article
      v-for="post in posts" :key="post.id"
      :with-repost="withRepost"
      :post="post"
      :account="account"
      :accountCurrent="accountCurrent"
      :chain="chain"
      @show="post=>$emit('show', post)"
    ></profile-blog-article>
    <no-ssr>
      <infinite-loading @infinite="infiniteHandler">
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
    },
    withRepost: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    infiniteHandler($state) {
      const posts = this.withRepost
        ? this.$store.state.profile.posts.collection
        : this.$store.state.profile.postsAuthor.collection

      if (!this.postsProcessing) {
        if (this.posts.length >= LIMIT) {
          let lastPost = (lastPost = posts[posts.length - 1])
          let dispatchPromise
          if (this.withRepost) {
            dispatchPromise = this.$store.dispatch('profile/fetchPostByBlog', {
              chain: this.chain,
              tag: this.$route.params.username,
              start_author: lastPost.author,
              start_permlink: lastPost.permlink,
              limit: LIMIT + 1
            })
          } else {
            dispatchPromise = this.$store.dispatch(
              'profile/fetchPostByAuthor',
              {
                chain: this.chain,
                author: this.$route.params.username,
                before_date: lastPost.created.replace('+00:00', ''),
                start_permlink: lastPost.permlink,
                limit: LIMIT + 1
              }
            )
          }

          dispatchPromise
            .then(posts => {
              $state.loaded()
              if (posts.length < LIMIT) {
                $state.complete()
              }
            })
            .catch(err => {
              $state.loaded()
              $state.complete()
              this.$toast.bottom(this.$t(`errors.failedAppendPostByAuthor`))
            })
        } else {
          $state.loaded()
          $state.complete()
        }
      } else setTimeout($state.loaded, 2000)
    }
  },
  computed: {
    messageOfEmptyPosts() {
      let message
      if (this.withRepost) {
        message = this.postsWithoutFilters.length
          ? 'emptyBlogByFilters'
          : 'emptyBlog'
      } else {
        message = this.postsWithoutRepost.length
          ? 'emptyBlogByFilters'
          : 'emptyBlog'
      }

      return message
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
      console.log(this.$store.state.profile)
      const posts = this.withRepost
        ? this.postsWithoutFilters
        : this.postsWithoutRepost

      return posts.filter(post => {
        let result = true
        const clearRepostsTags = tags => {
          let clearTags = Object.assign({}, tags)
          if (!this.withRepost) {
            clearTags = Object.keys(clearTags).reduce((obj, tagName) => {
              if (clearTags[tagName].owner) obj[tagName] = clearTags[tagName]
              return obj
            }, {})
          }
          return clearTags
        }
        const include = clearRepostsTags(this.$store.state.profile.tags.include)
        const exclude = clearRepostsTags(this.$store.state.profile.tags.exclude)

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
    },
    postsProcessing() {
      return this.withRepost
        ? this.$store.state.profile.posts.processing
        : this.$store.state.profile.postsAuthor.processing
    }
  }
}
</script>
