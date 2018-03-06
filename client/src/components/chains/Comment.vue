<template>
<div class="post-view__thread-wrapper" :class="{'payout_declined': true}" v-if="!deleted">
  <div class="comment">
    <div class="comment__wrapper">
      <div class="post-view__post-avatar avatar" :style="`background-image: url('${item.avatar || DEFAULT_AVATAR}');`"></div>
      <div class="comment__header">
        <!-- <router-link tag="a" :to="{name:'chain-account-view', params:{chain,username: item.author}}" class="link link--op">
          {{item.author}}
        </router-link> -->
        <a 
          :href="`/${chain}/@${item.author}`" 
          @click.prevent="goToProfile(item.author)"
          class="link link--op">
            {{item.author}}
        </a>
        <span class="post-view__post-author-rep">{{item.author_rep}}</span> · <time-ago :time="item.created"></time-ago>
      </div>
      <div class="comment__body" >
        <div class="markdown markdown--small" v-html="item.body" v-if="!editCommentShow"></div>
        <comment-form :post="item" :update="true" :special="false" @cancel="()=>setEditCommentShow(false)" @success="updateComment" v-if="editCommentShow"></comment-form>
      </div>
       <post-bottom 
          type="comment"
          :post="item" 
          :account="account" 
          :chain="chain"
          @vote="vote"
          @reply="reply"
          @edit="editPostBottom"
          @delete="deleteComment"
          :is-max-deep="isMaxDeep"
          :up-vote-processing="upVoteProcessing"
          :down-vote-processing="downVoteProcessing"
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
    <comment-form :post="item" :special="false" @change="checkCommentFormBody" @success="addComment" v-if="(commentFormAvailable && showCommentForm) || commentFormNotEmpty" @cancel="showCommentForm = false"></comment-form>
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
      nextLevel: this.level + 1,
      upVoteProcessing: false,
      downVoteProcessing: false,
      editCommentShow: false,
      deleted: false
    }
  },
  components: {
    CommentForm,
    PostBottom
  },
  mounted() {
    // fix for v-html with iframe
    this.$helper.videoWrapperHandler()
  },
  methods: {
    deleteComment() {
      this.deleted = true
    },
    updateComment(item) {
      this.$store.commit('updateReplie', { replie: item })
      Vue.nextTick(() => this.$helper.videoWrapperHandler())
      this.setEditCommentShow(false)
    },
    setEditCommentShow(flag) {
      this.editCommentShow = flag
    },
    editPostBottom() {
      this.setEditCommentShow(!this.editCommentShow)
    },
    goToProfile(username) {
      this.$store.commit('setPostViewData', null)
      this.$router.push({
        name: 'chain-account-view',
        params: { chain: this.chain, username }
      })
    },
    vote(isLike, weight = 10000) {
      const field = isLike ? 'upVoteProcessing' : 'downVoteProcessing'
      this[field] = true
      this.$store
        .dispatch('vote', {
          chain: this.chain,
          post: this.item,
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
    },
    commentFormAvailable() {
      return (
        !this.parentForm &&
        !this.isMaxDeep &&
        this.account.username &&
        (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ||
          this.$store.state.postView.post.mode !==
            CONSTANTS.BLOCKCHAIN.MODES.ARCHIVED)
      )
    }
  },
  computed: {
    DEFAULT_AVATAR() {
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

