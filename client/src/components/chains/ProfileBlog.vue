<template>
  <section class="blog">
    <div class="blog__header">
      <div class="blog__header-tab" :class="{'blog__header-tab--active': withRepost}" @click="$emit('update:withRepost', true)">
        {{$t('profile.allPosts')}}
      </div>
      <div class="blog__header-tab" :class="{'blog__header-tab--active': !withRepost}" @click="$emit('update:withRepost', false)">
        {{$t('profile.accountPosts', {username: account.name})}}
      </div>
    </div>
    <div class="blog__no-posts" v-if="!posts.length">{{$t('profile.emptyBlog')}}</div>
    <profile-blog-article
      v-for="post in posts" :key="post.id"
      :with-repost="withRepost"
      :post="post"
      :account="account"
      :accountCurrent="accountCurrent"
      :chain="chain"
      @show="showPost"
    ></profile-blog-article>
    <no-ssr>
      <infinite-loading @infinite="infiniteHandler">
        <center slot="spinner">
          <br><pulse-loader :color="'#383838'" :size="'10px'"></pulse-loader><br>
        </center>
        <span slot="no-more"></span>
      </infinite-loading>
    </no-ssr>
  </section>
</template>

<script>
import Vue from 'vue'
import CONSTANTS from '@oneplace/constants'
import ProfileBlogArticle from './ProfileBlogArticle.vue'
import InfiniteLoading from 'vue-infinite-loading'
const LIMIT = 5
export default {
  name: 'ProfileBlog',
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
  data() {
    return {
      postLoading: false
    }
  },
  components: {
    InfiniteLoading,
    ProfileBlogArticle
  },
  mounted() {
    this.$store.dispatch('core/fetchParams', {
      chain: this.chain,
      $chains: this.$chains
    })
  },
  methods: {
    infiniteHandler($state) {
      const posts = this.$store.state.profile.posts.collection
      if (!this.postsProcessing) {
        if (this.posts.length) {
          this.$store
            .dispatch('profile/fetchPostByAuthor', {
              chain: this.$route.params.chain,
              tag: this.$route.params.username,
              start_author: this.$route.params.username,
              start_permlink: posts[posts.length - 1].permlink,
              limit: LIMIT + 1
            })
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
      } else setTimeout($state.loaded, 200)
    },
    showPost(post) {
      const chain = this.chain
      if (!this.postLoading) {
        this.postLoading = true
        const target = {
          name: 'chain-post-view',
          params: {
            chain: chain,
            username: post.author,
            permlink: post.permlink
          }
        }
        this.$store
          .dispatch('fetchPostByPermlink', {
            chain: chain,
            username: post.author,
            permlink: post.permlink
          })
          .then(() => {
            history.pushState(
              '',
              post.title,
              this.$helper.makePathForPost(post, chain)
            )
            this.$store.commit('core/setRouterFrom', { target })
            this.postLoading = false
          })
      }
    }
  },
  computed: {
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
    posts() {
      return this.$store.state.profile.posts.collection.filter(post => {
        let result = true
        if (!this.withRepost && post.author !== this.account.name)
          result = false
        else {
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
        }
        return result
      })
    },
    postsProcessing() {
      return this.$store.state.profile.posts.processing
    }
  }
}
</script>
