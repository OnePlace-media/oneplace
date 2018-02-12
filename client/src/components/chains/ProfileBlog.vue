<template>
  <section class="blog">
    <div class="blog__header">
      <div class="blog__header-tab" :class="{'blog__header-tab--active': withRepost}" @click="withRepost = true">
        {{$t('profile.allPosts')}}
      </div>
      <div class="blog__header-tab" :class="{'blog__header-tab--active': !withRepost}" @click="withRepost = false">
        {{$t('profile.accountPosts', {username: account.name})}}
      </div>
    </div>
    <article class="blog__post" v-for="post in posts" :key="post.id">
      <a href="#" 
        v-if="post.image !== DEFAULT_IMAGE"
        class="blog__post-image" 
        :style="`background-image: url('${post.image}')`">
      </a>
      <div class="blog__post-content">
        
        <div class="blog__post-reposted" v-if="account.name !== post.author">{{$t('profile.repostedFrom')}}
          <span class="blog__repost-avatar" :style="`background-image: url('${post.avatar}');`"></span>
          <router-link tag="a" :to="{name:'chain-account-view', params:{chain:$route.params.chain,username:post.author}}" class="link link--op">{{post.author}}</router-link>
          <!-- <a :href="`/${$route.params.chain}/@${post.author}`" class="link link--op">
            {{post.author}}
          </a> -->
        </div>

        <h3 class="blog__post-title h3">
          <a @click.prevent="showPost(post)" :href="makePath(post)" class="link">{{post.title}}</a>
        </h3>
        <p class="blog__post-text"><a href="#" class="link">{{post.preview}}</a></p>
        <div class="blog__post-info" v-if="!$store.state.core.params[chain].processing">
          <span class="blog__post-time">
            {{$t('profile.posted')}}
            <timeago :since="post.created" :locale="$locale.current()"></timeago>
            </span>
          <post-bottom 
            type="blog"
            :post="post" 
            :account="accountCurrent" 
            :chain="chain" 
            @vote="(isLike, weight) => vote(post, isLike, weight)"
            :up-vote-processing="voteProcessing[post.id] ? voteProcessing[post.id].upVoteProcessing : false"
            :down-vote-processing="voteProcessing[post.id] ? voteProcessing[post.id].downVoteProcessing : false"
          ></post-bottom>
        </div>
      </div>
    </article>
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
import PostBottom from './PostBottom.vue'
import InfiniteLoading from 'vue-infinite-loading'
const LIMIT = 5
export default {
  name: 'ProfileBlog',
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      withRepost: true,
      postLoading: false,
      voteProcessing: {}
    }
  },
  components: {
    InfiniteLoading,
    PostBottom
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
        this.$store
          .dispatch('profile/appendPostByAuthor', {
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
      } else 
        setTimeout($state.loaded, 200)
    },
    vote(post, isLike, weight = 10000) {
      if (!this.voteProcessing[post.id]) {
        Vue.set(this.voteProcessing, post.id, {
          upVoteProcessing: false,
          downVoteProcessing: false
        })
      }

      const field = isLike ? 'upVoteProcessing' : 'downVoteProcessing'
      this.voteProcessing[post.id][field] = true
      this.$store
        .dispatch('vote', {
          chain: this.chain,
          post: post,
          account: this.accountCurrent,
          isLike,
          weight
        })
        .then(() => {
          this.voteProcessing[post.id][field] = false
        })
        .catch(err => {
          this.voteProcessing[post.id][field] = false
          this.$toast.bottom(this.$t(`errors.${err.response.data.error.code}`))
        })
    },
    makePath(post, chain) {
      return `/${chain || this.chain}/@${post.author}/${post.permlink}`
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
            history.pushState('', post.title, this.makePath(post, chain))

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
    DEFAULT_IMAGE() {
      return CONSTANTS.DEFAULT.POST_IMAGE
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    },
    posts() {
      return this.$store.state.profile.posts.collection.filter(post => {
        return this.withRepost || post.author === this.account.name
      })
    },
    postsProcessing() {
      return this.$store.state.profile.posts.processing
    }
  }
}
</script>
