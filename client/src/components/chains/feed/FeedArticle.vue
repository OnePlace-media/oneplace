<template>
  <article class="feed__post">
    <a 
      href="#" 
      class="feed__post-image" 
      :style="`background-image: url('${post.image}')`">
    </a>
    <div class="feed__post-content">
      <div class="feed__post-reposted" v-if="isRepost">
        {{$t('feed.repostedBy')}}
        <span 
          class="feed__repost-avatar" 
          :style="`background-image: url('${post.reblog_avatars[0]}');`"
        ></span>
        <a href="#" class="link link--op">{{post.reblog_by[0]}}</a>
      </div>
  
        <h3 class="feed__post-title h3">
          <a href="#" class="link">{{cutTitle}}</a>
        </h3>
        <p class="feed__post-text"><a href="#" class="link">{{cutPreview}}</a></p>
  
      <div class="feed__post-info">
        <div class="feed__post-author">
          <a href="#" 
            class="feed__post-avatar avatar" 
            :style="`background-image: url('${post.avatar}');`">
          </a>
          <div class="column-wrapper">
            <router-link tag="a" :to="{name:'chain-account-view', params:{chain: chain, username:post.author}}" class="link link--op">{{post.author}}</router-link>
            <time-ago :time="post.created"></time-ago>
          </div>
        </div>
  
          <!-- <post-bottom
            type="blog"
            :post="post"
            :account="accountCurrent"
            :chain="chain"
            @focus="()=>$emit('focus', post)"
            @vote="(isLike, weight) => vote(post, isLike, weight)"
            :up-vote-processing="voteProcessing.upVoteProcessing"
            :down-vote-processing="voteProcessing.downVoteProcessing"
          ></post-bottom> -->
      </div>
    </div>
  </article>
</template>

<script>
import PostBottom from './../post/PostBottom.vue'
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
  computed: {
    cutTitle() {
      return parser.cutTitle(this.chain, this.post.title)
    },
    cutPreview() {
      return parser.cutPreview(this.chain, this.post.preview, this.isRepost)
    },
    isRepost() {
      return this.post.reblog_by.length > 0
    }
  }
}
</script>
