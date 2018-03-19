<template>
  <div class="post-view__post-wrapper">
    <div class="post-view__top-bar">
      <span class="post-view__back" >{{$t('common.back')}}</span>
      <span class="post-view__close-post" @click="close"></span>
    </div>
    <div class="post-view__post">
      <div class="post-view__post-info post-view__post-info--top">
        <div class="post-view__post-avatar avatar" 
          :style="`background-image: url('${post.avatar || DEFAULT_AVATAR}');`">
        </div>
        <div class="column-wrapper">
          <span class="post-view__post-author-tag">
            <!-- <router-link 
              tag="a" 
              :to="{name:'chain-account-view', params:{chain: $route.params.chain, username: post.author}}" 
              class="post-view__author-link link link--op">
              {{post.author}}
            </router-link> -->
            <a 
              tag="a" 
              @click.prevent="goToProfile(post.author)"
              :href="`/${$route.params.chain}/@${post.author}`" 
              class="link link--op">
              {{post.author}}
            </a>
            <span class="post-view__post-author-rep">{{post.author_rep}}</span><br>&nbsp;{{$t('common.in')}}&nbsp;<span class="hashtag">#{{post.category | unGolosTag | toLowerCase}}</span>
          </span>
          <span class="post-view__post-posted">
            <time-ago :time="post.created"></time-ago>
          </span>
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
      <div class="post-view__post-body markdown" v-html="post.body" id="post-body"></div>
      <div class="post-view__post-info post-view__post-info--bottom" v-if="!$store.state.core.params[chain].processing">
        <post-bottom 
            type="post"
            :post="post" 
            :account="account" 
            :chain="chain" 
            @vote="vote"
            @edit="edit"
            :up-vote-processing="upVoteProcessing"
            :down-vote-processing="downVoteProcessing"
          ></post-bottom>
      </div>
      <section class="post-view__bottom-block">
        <div class="post-view__author-wrapper">
          <h2 class="h2 post-view__block-title">{{$t('common.author')}}</h2>
          <div class="post-view__avatar-wrapper">
            <div class="post-view__author-avatar avatar" :style="`background-image: url('${post.avatar || DEFAULT_AVATAR}');`"></div>
            <span class="post-view__author-rep">{{post.author_rep}}</span>
          </div>
          <div class="post-view__author-info">
            <!-- <router-link tag="a" :to="{name:'chain-account-view', params:{chain:$route.params.chain,username:post.author}}" class="link link--op">
              {{post.author}}
            </router-link> -->
            <a 
              @click.prevent="goToProfile(post.author)"
              :href="`/${$route.params.chain}/@${post.author}`" 
              class="link link--op">
              {{post.author}}
            </a>
            <p class="author-info">{{post.author_about}}</p>
            <!-- <no-ssr v-if="$auth && $auth.check() && account.username">
              <profile-follow-btn
                :chain="chain"
                :account-follower="account"
                :account-following="postAccount"
                type="post"
              ></profile-follow-btn>
            </no-ssr> -->
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
import ProfileFollowBtn from '../../components/chains/ProfileFollowBtn.vue'

export default {
  name: 'PostView',
  props: ['isModal'],
  mixins: [onClickOutside],
  components: {
    PostBottom,
    ProfileFollowBtn
  },
  watch: {
    $route() {
      this.$store.commit('setPostViewData', null)
    }
  },
  beforeRouteUpdate() {
    console.log('beforeRouteUpdate')
  },
  mounted() {
    this.$store.dispatch('core/fetchParams', {
      chain: this.chain,
      $chains: this.$chains
    })

    // fix for v-html with iframe
    this.$helper.videoWrapperHandler()
  },
  data() {
    return {
      showDropDownMenu: false,
      comment: null,
      upVoteProcessing: false,
      downVoteProcessing: false
    }
  },
  metaInfo() {
    return this.$helper.generatePostMeta(this.post, this.$route)
  },
  methods: {
    edit() {
      this.$router.push({
        name: 'post-edit',
        params: {
          chain: this.chain,
          username: this.post.author,
          permlink: this.post.permlink
        }
      })
    },
    goToProfile(username) {
      if (username === this.post.author) {
        this.$store.commit('setPostViewData', null)
      }

      this.$router.push({
        name: 'chain-account-view',
        params: { chain: this.chain, username }
      })
    },
    toggleDropDown() {
      this.showDropDownMenu = !this.showDropDownMenu
    },
    close() {
      history.go(-1)
      this.$store.commit('setPostViewData', null)
    },
    vote(isLike, weight = 10000) {
      const field = isLike ? 'upVoteProcessing' : 'downVoteProcessing'
      this[field] = true
      this.$store
        .dispatch('vote', {
          chain: this.chain,
          post: this.post,
          account: this.account,
          isLike,
          weight
        })
        .then(() => {
          this[field] = false
        })
        .catch(err => {
          this[field] = false
          this.$toast.bottom(this.$t(`errors.${err.response.data.error.code}`))
        })
    }
  },
  computed: {
    DEFAULT_AVATAR() {
      return CONSTANTS.DEFAULT.AVATAR_IMAGE
    },
    post() {
      return this.$store.state.postView.post
    },
    postAccount() {
      return { name: this.post.author }
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
      let result = { avatar: this.DEFAULT_AVATAR, username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    },
    isDislike() {
      return this.account.username
        ? !!this.post.active_votes.find(
            vote =>
              vote.voter === this.account.username &&
              (vote.percent < 0 || vote.weight < 0)
          )
        : false
    }
  }
}
</script>
