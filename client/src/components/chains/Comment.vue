<template>
<div class="post-view__thread-wrapper" :class="{'payout_declined': true}">
  <div class="comment">
    <div class="comment__wrapper">
      <div class="post-view__post-avatar avatar" :style="`background-image: url('${item.avatar || DEFAULT_AVATAR}');`"></div>
      <div class="comment__header">
        <router-link tag="a" :to="{name:'chain-account-view', params:{chain,username:account.username}}" class="link link--op">
          {{account.username}}
        </router-link>
        <span class="post-view__post-author-rep">{{item.author_rep}}</span> · <timeago :since="item.created" :locale="$locale.current()"></timeago>
      </div>
      <div class="comment__body markdown markdown--small" v-html="item.body"></div>
       <post-bottom 
            type="comment"
            :post="item" 
            :account="account" 
            :chain="chain"
            @vote="vote"
            @reply="reply"
            :is-max-deep="isMaxDeep"
          ></post-bottom>
    </div>
  </div>
  <div class="comment__replies">
    <comment 
      v-if="!isMaxDeep"
      v-for="subItem in item.replies" 
      :item="subItem" 
      :key="subItem.permlink" 
      :level="nextLevel" 
      :parentForm="showCommentForm" 
      @reply="childrenReply" 
      :account="account">
    </comment>
    <comment-form :post="item" :special="false" @change="checkCommentFormBody" @success="addComment" v-if="(!isMaxDeep && showCommentForm && !parentForm) || commentFormNotEmpty" @cancel="showCommentForm = false"></comment-form>
  </div>
</div>
</template>

<script>
import Api from '../../plugins/api'
import CONSTANTS from '@oneplace/constants'
import CommentForm from './CommentForm.vue'
import PostBottom from './PostBottom.vue'
import Vue from 'vue'
export default {
  name: 'comment',
  props: ['item', 'account', 'parentForm', 'level'],
  data() {
    return {
      showCommentForm: false,
      commentFormNotEmpty: false,
      nextLevel: this.level + 1
    }
  },
  components: {
    CommentForm,
    PostBottom
  },
  methods: {
    vote(isLike) {
      this.$store.dispatch('vote', {
        chain: this.chain,
        post: this.item,
        account: this.account,
        isLike
      })
    },
    checkCommentFormBody(body) {
      this.commentFormNotEmpty = !!body
    },
    addComment(comment) {
      if (!this.item.replies) {
        Vue.set(this.item, 'replies', [])
      }
      this.item.replies.unshift(comment)
      this.commentFormNotEmpty = false
      this.showCommentForm = false
    },
    reply() {
      this.showCommentForm = true
      this.$emit('reply')
    },
    childrenReply() {
      this.showCommentForm = false
    }
  },
  computed: {
    DEFAULT_AVATAR(){
      return CONSTANTS.DEFAULT.AVATAR_IMAGE
    },
    isMaxDeep() {
      return this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS && this.level >= 5
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    }
  }
}
</script>

