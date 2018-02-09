<template>
  <div class="post-view__comments-wrapper">
      <no-ssr v-if="$auth && $auth.ready()">
        <div class="post-view__reply-disabled" v-if="!account.username">
          <span>{{$t('comment.onlyRegisteredCanLeaveComments',{blockchain: chainName})}}</span>&nbsp;
          <i18n path="comment.loginOrRegisterToReply" tag="span" v-if="!$auth.check()">
            <span place="nbsp">&nbsp;</span>
            <span place="blockchain">{{chainName}}</span>
            <router-link :to="{name:'auth-login'}" class="link link--op" place="login-link">{{$t('comment.logIn')}}</router-link>
            <router-link :to="{name:'auth-registration'}" class="link link--op" place="reg-link">{{$t('comment.register')}}</router-link>
          </i18n>
          <i18n path="comment.addAccountToReply" tag="span" v-if="$auth.check()">
            <router-link :to="{name:'add-account',params:{chain: $route.params.chain}}" class="link link--op" place="add-account" v-html="$t('comment.addAccounChain',{blockchain:chainName})"></router-link>
          </i18n>
        </div>
      </no-ssr>

      <comment-form @success="addComment" :special="true" :post="post" v-if="account.username"></comment-form>
      
      <div class="post-view__comments-header" v-if="!repliesProcessing && replies.length">
        <h3 class="h3 post-view__comments-title">{{$t('comment.header')}}</h3>
        <span class="post-view__comments-order">{{$t('common.orderBy')}}: <span class="post-view__comments-order-selected" @click="toggleCommentsOrder">{{$t(`comment.orderBy.${orderBySelected.value}`)}}</span>
        <ul class="post-view__comments-options" v-if="dropDownShow" v-on-click-outside="toggleCommentsOrder">
          <li class="post-view__comments-options-item" v-for="elem in orderByList" :key="elem.value" @click="orderByChange(elem)">{{$t(`comment.orderBy.${elem.value}`)}}</li>
        </ul>
        </span>
      </div>
      <div class="comments__spinner" v-show="repliesProcessing">
        <center><pulse-loader :loading="repliesProcessing" :color="'#383838'" :size="'10px'"></pulse-loader></center>
      </div>
      <section class="post-view__comments">
        <comment v-for="item in replies" :account="account" :item="item" :key="item.permlink" :level="1"></comment>
      </section>
  </div>
</template>

<script>
import Comment from './Comment.vue'
import CommentForm from './CommentForm.vue'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import { ORDER_BY_LIST } from '@oneplace/constants'
import CONSTANTS from '@oneplace/constants'

const orderByList = [
  { value: ORDER_BY_LIST.TRENDING },
  { value: ORDER_BY_LIST.POPULAR },
  { value: ORDER_BY_LIST.RECENT_FIRST },
  { value: ORDER_BY_LIST.OLDEST_FIRTS }
]
export default {
  name: 'CommentsWrapper',
  components: {
    Comment,
    CommentForm
  },
  mixins: [onClickOutside],
  props: ['post'],
  data() {
    return {
      dropDownShow: false,
      orderBySelected: orderByList[0]
    }
  },
  computed: {
    chainName() {
      return {
        s: 'Steem',
        g: 'Golos'
      }[this.$route.params.chain]
    },
    orderByList() {
      return orderByList
    },
    replies() {
      return this.$store.state.postView.replies || []
    },
    repliesProcessing() {
      return this.$store.state.postView.repliesProcessing
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
      let result = { avatar: CONSTANTS.DEFAULT.AVATAR_IMAGE, username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    }
  },
  methods: {
    orderByChange(elem) {
      this.orderBySelected = elem
      this.toggleCommentsOrder()
      this.$store.commit('sortPostViewReplies', elem.value)
    },
    toggleCommentsOrder() {
      this.dropDownShow = !this.dropDownShow
    },
    addComment(comment) {
      this.$store.commit('addPostViewReplie', comment)
    }
  },
  beforeMount() {
    this.$store.dispatch('fetchRepliesByPermlink', {
      chain: this.$route.params.chain,
      username: this.post.author,
      permlink: this.post.permlink
    })
  }
}
</script>
