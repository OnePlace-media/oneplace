<template>
  <article class="feed__post">
    <a 
      class="feed__post-image" 
      :href="link"
      @click.prevent="show"
      v-if="post.image !== DEFAULT_IMAGE"
      :style="`background-image: url('${post.image}')`">
      <div class="nsfw-image" 
        v-if="post.nsfw && post.nsfw !== 'show'"
        @click.stop.prevent="post.nsfw = 'show'">
        {{$t('chains.imageIsHidden')}}
      </div>
    </a>
    <div class="feed__post-content">
      <div class="feed__post-reposted" v-if="isRepost">
        {{$t('feed.repostedBy')}}
        <span 
          class="feed__repost-avatar" 
          :style="`background-image: url('${post.reblog_avatars[0]}');`"
        ></span>
        <router-link tag="a" :to="{name:'chain-account-view', params:{chain: chain, username:post.reblog_by[0]}}" class="link link--op">
          {{post.reblog_by[0]}}
        </router-link>
      </div>
  
        <h3 class="feed__post-title h3">
          <a 
            :href="link"
            @click.prevent="show"
            class="link">
            <span class="nsfw-warning" v-show="post.nsfw">nsfw</span>
            {{post.title}}
          </a>
        </h3>
        <p class="feed__post-text" :class="{'lines-2x': lines2x, 'lines-1x': lines1x}">
          <a 
            :href="link"
            @click.prevent="show"
            class="link">{{cutPreview}}
          </a>
        </p>
  
      <div class="feed__post-info">
        <div class="feed__post-author">
          <router-link 
            tag="a" 
            :to="{name:'chain-account-view', params:{chain: chain, username:post.author}}" 
            :style="`background-image: url('${post.avatar}');`"
            class="feed__post-avatar avatar">
          </router-link>
          <div class="column-wrapper">
            <router-link tag="a" :to="{name:'chain-account-view', params:{chain: chain, username:post.author}}" class="link link--op">{{post.author}}</router-link>
            <time-ago :time="post.created"></time-ago>
          </div>
        </div>
  
          <post-bottom
            type="blog"
            :post="post"
            :account="account"
          ></post-bottom>
      </div>
    </div>
  </article>
</template>

<script>
import CONSTANTS from '@oneplace/constants'
import PostBottom from './../post/PostBottom.vue'
import EventBus from '../../../event-bus'
const parser = require('@oneplace/blockchains-api/parser')
export default {
  name: 'FeedArticle',
  components: {
    PostBottom
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    chain: {
      type: String,
      default() {
        return this.$route.params.chain
      }
    }
  },
  data() {
    return {
      lines2x: false,
      lines1x: false
    }
  },
  methods: {
    show() {
      EventBus.$emit('POST:MODAL:SHOW', {
        post: this.post,
        chain: this.chain
      })
    }
  },
  computed: {
    DEFAULT_IMAGE() {
      return CONSTANTS.DEFAULT.POST_IMAGE
    },
    link() {
      return this.$helper.makePathForPost(this.post, this.chain)
    },
    cutPreview() {
      return parser.cutPreview(this.post.preview)
    },
    isRepost() {
      return this.post.reblog_by.length > 0
    },
    accounts() {
      return this.$auth && this.$auth.check() ? this.$auth.user().accounts : []
    },
    accountsByChain() {
      return this.accounts.filter(acc => acc.chain === this.chain)
    },
    account() {
      let result = { avatar: this.DEFAULT_AVATAR, username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    }
  },
  updated() {
    const titleEl = this.$el.getElementsByClassName('feed__post-title')[0]
    if (titleEl) {
      const rect = titleEl.getBoundingClientRect()
      this.lines1x = rect.height > 23 && this.isRepost
      this.lines2x = !this.lines1x && (rect.height > 23 || this.isRepost)
    }
  }
}
</script>
