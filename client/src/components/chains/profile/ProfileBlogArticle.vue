<template>
  <article class="blog__post">
      <a 
        @click.prevent="$emit('show', post)" 
        :href="$helper.makePathForPost(post, chain)"
        :title="post.title"
        v-if="post.image !== DEFAULT_IMAGE"
        class="blog__post-image" 
        :style="`background-image: url('${post.image}')`">
      </a>
      <div class="blog__post-content">
        
        <div class="blog__post-reposted" v-if="isRepost">{{$t('profile.repostedFrom')}}
          <span class="blog__repost-avatar" :style="`background-image: url('${post.avatar}');`"></span>
          <router-link tag="a" :to="{name:'chain-account-view', params:{chain: chain, username:post.author}}" class="link link--op">{{post.author}}</router-link>
          <!-- <a :href="`/${$route.params.chain}/@${post.author}`" class="link link--op">
            {{post.author}}
          </a> -->
        </div>

        <h3 class="blog__post-title h3">
          <a @click.prevent="$emit('show', post)" :href="$helper.makePathForPost(post, chain)" class="link" :title="post.title">{{cutTitle}}</a>
        </h3>
        <p class="blog__post-text">
          <a @click.prevent="$emit('show', post)" :href="$helper.makePathForPost(post, chain)" class="link">{{cutPreview}}</a>
        </p>
        <div class="blog__post-info" v-if="!$store.state.core.params[chain].processing">
          <span class="blog__post-time">
            <time-ago :time="post.created"></time-ago>
          </span>
          <post-bottom
            type="blog"
            :post="post"
            :account="accountCurrent"
            :chain="chain"
            @focus="()=>$emit('focus', post)"
            @vote="(isLike, weight) => vote(post, isLike, weight)"
            :up-vote-processing="voteProcessing.upVoteProcessing"
            :down-vote-processing="voteProcessing.downVoteProcessing"
          ></post-bottom>
        </div>
      </div>
    </article>
</template>

<script>
import CONSTANTS from '@oneplace/constants'
import PostBottom from './../post/PostBottom.vue'
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
      }
    }
  },
  computed: {
    DEFAULT_IMAGE() {
      return CONSTANTS.DEFAULT.POST_IMAGE
    },
    isRepost() {
      return this.account.name !== this.post.author
    },
    cutTitle() {
      return parser.cutTitle(this.chain, this.post.title)
    },
    cutPreview() {
      return parser.cutPreview(this.chain, this.post.preview, this.isRepost)
    }
  },
  methods: {
    vote(post, isLike, weight = 10000) {
      const field = isLike ? 'upVoteProcessing' : 'downVoteProcessing'
      this.voteProcessing[field] = true
      this.$store
        .dispatch('vote', {
          chain: this.chain,
          post: post,
          account: this.accountCurrent,
          isLike,
          weight
        })
        .then(() => {
          this.voteProcessing[field] = false
        })
        .catch(err => {
          this.voteProcessing[field] = false
          this.$toast.bottom(this.$t(`errors.${err.response.data.error.code}`))
        })
    }
  }
}
</script>

