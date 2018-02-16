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
            {{$t('profile.posted')}}
            <timeago :since="post.created" :locale="$locale.current()"></timeago>
            </span>
          <post-bottom 
            type="blog"
            :post="post" 
            :account="accountCurrent" 
            :chain="chain" 
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
import PostBottom from './PostBottom.vue'
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
      const STR_LIMIT = this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS ? 70 : 80
      let str = this.post.title
      if (str.length > STR_LIMIT) {
        str = str.substring(0, str.substr(0, STR_LIMIT).split('').lastIndexOf(' ')) + '...'
      }
      return str
    },
    cutPreview() {
      let STR_LIMIT = this.isRepost ? 50 : 110
      if(this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS)
        STR_LIMIT = this.isRepost ? 50 : 90

      let str = this.post.preview
      if (str.length > STR_LIMIT) {
        str = str.substring(0, str.substr(0, STR_LIMIT).split('').lastIndexOf(' ')) + '...'
      }
      return str
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

