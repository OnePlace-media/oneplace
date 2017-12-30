<template>
<div class="post-view__thread-wrapper" :class="{'payout_declined': true}">
  <div class="comment">
    <div class="comment__wrapper">
      <div class="post-view__post-avatar avatar" :style="`background-image: url('${item.avatar || '/static/img/avatar.svg'}');`"></div>
      <div class="comment__header">
       <a class="link link--op" :href="`/${$route.params.chain}/@${item.author}`" target="_blank">{{item.author}}</a> 
        <span class="post-view__post-author-rep">{{item.author_rep}}</span> · <timeago :since="item.created" :locale="$locale.current()"></timeago>
      </div>
      <div class="comment__body markdown markdown--small" v-html="item.body"></div>
      <div class="comment__post-data">
        <span class="post-view__post-data-item"><span class="post-view__post-value">{{currencySymbol}}</span>{{item.payout}}</span>
        <span class="post-view__post-data-item">
          <a 
            @click.prevent="vote(true)"
            class="post-view__post-like" 
            :class="{'post-view__post-like--active': isLiked}" 
            :title="isLiked ? $t('comment.removeVote') : $t('comment.like')"
          >
            <svg class="post-view__icon post-view__icon--small post-view__icon-like">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#like"></use>
            </svg>
          </a>{{likeVotes}}</span>
        <span class="post-view__post-data-item">
          <a 
            @click.prevent="vote(false)"
            class="post-view__post-like" 
            :class="{'post-view__post-like--active': isDislaked}" 
            :title="isDislaked ? $t('comment.removeVote') : $t('comment.dislike')">
            <svg class="post-view__icon post-view__icon--small post-view__icon-dislike">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#like"></use>
            </svg>
          </a>{{dislikeVotes}}
        </span>
        <a href="#"
          v-if="!isMaxDeep && account.username"
           class="post-view__post-data-item link" 
          :title="$t('common.reply')"
          v-scroll-to="`#comment-input-${item.permlink}`"
          @click.prevent="reply">{{$t('common.reply')}}</a>
      </div>
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
    CommentForm
  },
  methods: {
    vote(isLike) {
      if (this.account.username) {
        let weight = isLike ? 10000 : -10000
        if ((this.isLiked && isLike) || (this.isDislaked && !isLike)) {
          weight = 0
        }
        Api.vote(
          this.chain,
          this.account.username,
          this.item.author,
          this.item.permlink,
          weight
        )
          .then(response => {
            const vote = response.data
            this.item.active_votes = this.item.active_votes.filter(
              _vote => _vote.voter !== vote.voter
            )
            this.item.active_votes.push(vote)
            return Api.getPostByPermlink(
              this.chain,
              this.item.author,
              this.item.permlink
            )
          })
          .then(response => {
            this.item.payout = response.data.payout
          })
          .catch(err => {
            this.$toast.bottom(
              this.$t(`errors.${err.response.data.error.code}`)
            )
          })
      }
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
    isMaxDeep() {
      return this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS && this.level >= 5
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    },
    currencySymbol() {
      return this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS ? '₽' : '$'
    },
    isLiked() {
      return this.$auth.ready() && this.$auth.check() && this.account
        ? !!this.item.active_votes.find(
            vote =>
              vote.voter === this.account.username &&
              (vote.percent > 0 || vote.weight > 0)
          )
        : false
    },
    isDislaked() {
      return this.$auth.ready() && this.$auth.check() && this.account
        ? !!this.item.active_votes.find(
            vote =>
              vote.voter === this.account.username &&
              (vote.percent < 0 || vote.weight < 0)
          )
        : false
    },
    likeVotes() {
      return this.item.active_votes.filter(
        vote => +vote.weight > 0 || +vote.percent > 0
      ).length
    },
    dislikeVotes() {
      return this.item.active_votes.filter(
        vote => +vote.weight < 0 || +vote.percent < 0
      ).length
    }
  }
}
</script>

