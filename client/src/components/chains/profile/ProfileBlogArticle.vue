<template>
  <article class="feed__post">
      <a 
        @click.prevent="show" 
        :href="$helper.makePathForPost(post, chain)"
        :title="post.title"
        v-if="post.image !== DEFAULT_IMAGE"
        class="feed__post-image" 
        :style="`background-image: url('${post.image}')`">
        <div class="nsfw-image" 
          v-if="post.nsfw && post.nsfw !== 'show'"
          @click.stop.prevent="post.nsfw = 'show'">
          {{$t('chains.imageIsHidden')}}
        </div>
      </a>
      <div class="feed__post-content">
        
        <div class="feed__post-reposted" v-if="isRepost">{{$t('profile.repostedFrom')}}
          <span class="blog__repost-avatar" :style="`background-image: url('${post.avatar}');`"></span>
          <router-link tag="a" :to="{name:'chain-account-view', params:{chain: chain, username:post.author}}" class="link link--op">{{post.author}}</router-link>
        </div>

        <h3 class="feed__post-title h3">
          <a @click.prevent="show" :href="$helper.makePathForPost(post, chain)" class="link" :title="post.title">
            <span class="nsfw-warning" v-show="post.nsfw">nsfw</span>
            {{post.title}}</a>
        </h3>
        <p class="feed__post-text" :class="{'lines-2x': lines2x, 'lines-1x': lines1x}">
          <a @click.prevent="show" :href="$helper.makePathForPost(post, chain)" class="link">{{cutPreview}}</a>
        </p>
        <div class="feed__post-info" v-if="!$store.state.core.params[chain].processing">
          <span class="blog__post-time">
            <time-ago :time="post.created"></time-ago>
          </span>
          <post-bottom
            type="blog"
            :post="post"
            :account="accountCurrent"
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
  name: 'ProfileBlogArticle',
  components: {
    PostBottom
  },
  props: {
    chain: {
      type: String,
      required: true
    },
    accountCurrent: {
      type: Object,
      required: true
    },
    account: {
      type: Object,
      required: true
    },
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      voteProcessing: {
        upVoteProcessing: false,
        downVoteProcessing: false
      },
      lines1x: false,
      lines2x: false
    }
  },
  computed: {
    DEFAULT_IMAGE() {
      return CONSTANTS.DEFAULT.POST_IMAGE
    },
    isRepost() {
      return this.account.name !== this.post.author
    },
    cutPreview() {
      return parser.cutPreview(this.post.preview)
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

