<template>
<div class="post-view__post-wrapper">
  <div class="post-view__top-bar">
    <span class="post-view__back" >{{$t('common.back')}}</span>
    <span class="post-view__close-post" @click="close"></span>
  </div>
  <div class="post-view__post">
    <div class="post-view__post-info post-view__post-info--top">
      <div class="post-view__post-avatar avatar" 
        :style="`background-image: url('${post.avatar || '/static/img/avatar.svg'}');`">
      </div>
      <div class="column-wrapper">
        <span class="post-view__post-author-tag">
          <a class="post-view__author-link link link--op" :href="`/${$route.params.chain}/@${post.author}`" target="_blank">{{post.author}}</a>
          <span class="post-view__post-author-rep">{{post.author_rep}}</span><br>&nbsp;{{$t('common.in')}}&nbsp;<span class="hashtag">#{{post.category | unGolosTag | toLowerCase}}</span>
        </span>
        <span class="post-view__post-posted"><timeago :since="post.created" :locale="$locale.current()"></timeago></span>
      </div>
      <span class="post-view__action-menu-btn" @click.prevent="toggleDropDown" v-if="account.username" >• • •</span>
      <div class="post-view__action-menu" v-if="showDropDownMenu">
        <span class="post-view__post-flag" :class="{'post-view__post-flag--active': isDislike}" @click="vote(false)" v-on-click-outside="toggleDropDown">
          <svg class="post-view__icon post-view__icon-flag">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#flag"></use>
          </svg>
          <span v-if="!isDislike">{{$t('chains.downvotePost')}}</span>
          <span v-if="isDislike">{{$t('chains.removeFlag')}}</span>
        </span>
      </div>
    </div>
    <header class="post-view__post-heading">
      <h1 class="h1 post-view__post-title">{{post.title}}</h1>
    </header>
    <div class="post-view__post-body markdown" v-html="post.body"></div>
    <post-bottom 
      :post="post" 
      :account="account" 
      :chain="chain" 
      :like-votes="likeVotes"
      :dislike-votes="dislikeVotes"
      :is-like="isLike"
      :is-dislike="isDislike"
      @vote="vote"
    ></post-bottom>
    <section class="post-view__bottom-block">
      <div class="post-view__author-wrapper">
        <h2 class="h2 post-view__block-title">{{$t('common.author')}}</h2>
        <div class="post-view__avatar-wrapper">
          <div class="post-view__author-avatar avatar" :style="`background-image: url('${post.avatar || '/static/img/avatar.svg'}');`"></div>
          <span class="post-view__author-rep">{{post.author_rep}}</span>
        </div>
        <div class="post-view__author-info">
          <a class="link link--op" target="_blank" :href="`/${$route.params.chain}/@${post.author}`">{{post.author}}</a>
          <p class="author-info">{{post.author_about}}</p>
        </div>
      </div>
      <div class="post-view__tags-wrapper">
        <h2 class="h2 post-view__block-title">{{$t('common.tags')}}</h2>
        <div class="tags-list__wrapper">
          <span class="tags-list__item" v-for="(category, index) in post.tags" :key="index">{{category | unGolosTag | toLowerCase}}</span>
        </div>
      </div>
    </section>
  </div>
</div>
</template>

<script>
import CONSTANTS from '@oneplace/constants'
import Api from '../../plugins/api'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import PostBottom from './PostBottom.vue'

export default {
  name: 'PostView',
  props: ['isModal'],
  mixins: [onClickOutside],
  components: {
    PostBottom
  },
  mounted() {
    this.$store.dispatch('fetchParams', {
      chain: this.chain,
      $chains: this.$chains
    })
  },
  data() {
    return {
      showDropDownMenu: false,
      comment: null
    }
  },
  metaInfo() {
    const IMAGE = process.env.BASE_API_URL + `img?l=${encodeURIComponent(this.post.image)}`
    return {
      title: this.post.title,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.post.preview
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: this.post.title + ' | OnePlace.media'
        },
        { vmid: 'og:type', property: 'og:type', content: 'article' },
        {
          vmid: 'article:tag',
          property: 'article:tag',
          content: this.post.category
        },
        {
          vmid: 'article:published_time',
          property: 'article:published_time',
          content: this.post.created
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: `https://oneplace.media${this.$route.path}`
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content: IMAGE
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: this.post.preview
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'OnePlace.media'
        },
        {
          vmid: 'twitter:image',
          name: 'twitter:image',
          content: IMAGE
        },
        {
          vmid: 'twitter:card',
          name: 'twitter:site',
          content: '@oneplace.media'
        },
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: this.post.title + ' | OnePlace.media'
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content: this.post.preview
        }
      ]
    }
  },
  methods: {
    toggleDropDown() {
      this.showDropDownMenu = !this.showDropDownMenu
    },
    close() {
      history.go(-1)
      this.$store.commit('setPostViewData', null)
    },
    vote(isLike, weight = 10000) {
      if (this.account.username) {
        weight = isLike ? weight : -10000
        if ((this.isLike && isLike) || (this.isDislike && !isLike)) {
          weight = 0
        }
        Api.vote(
          this.chain,
          this.account.username,
          this.post.author,
          this.post.permlink,
          weight
        )
          .then(response => {
            const vote = response.data
            this.post.votes = this.post.votes.filter(
              _vote => _vote.voter !== vote.voter
            )
            return Api.getPostByPermlink(
              this.chain,
              this.post.author,
              this.post.permlink
            )
          })
          .then(response => {
            this.post.payout = response.data.payout
            this.post.votes = response.data.votes
          })
          .catch(err => {
            this.$toast.bottom(
              this.$t(`errors.${err.response.data.error.code}`)
            )
          })
      }
    }
  },
  computed: {
    post() {
      return this.$store.state.postView.post
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    },
    accountsByChain() {
      return this.accounts.filter(acc => acc.chain === this.chain)
    },
    accounts() {
      return this.$auth && this.$auth.check() ? this.$auth.user().accounts : []
    },
    account() {
      let result = { avatar: '/static/img/avatar.svg', username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    },
    isLike() {
      return (
        this.myVote && (+this.myVote.weight > 0 || +this.myVote.percent > 0)
      )
    },
    isDislike() {
      return (
        this.myVote && (+this.myVote.weight < 0 || +this.myVote.percent < 0)
      )
    },
    likeVotes() {
      return this.post.votes.filter(
        vote => +vote.weight > 0 || +vote.percent > 0
      ).length
    },
    dislikeVotes() {
      return this.post.votes.filter(
        vote => +vote.weight < 0 || +vote.percent < 0
      ).length
    },
    myVote() {
      const vote = this.post.votes.find(
        _vote => _vote.voter === this.account.username
      )
      return vote
    }
  }
}
</script>
