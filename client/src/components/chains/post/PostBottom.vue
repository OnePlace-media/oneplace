<template>
  <div :class="{'blog__post-data': isBlog, 'post-view__post-data':isPost, 'comment__post-data': isComment}">
    <span class="post-view__post-data-item" :class="{'post-view__post-value-correction': showPayoutWithVote}">
      <span class="post-view__post-currency" :class="{'payout-declined': post.payout_declined}">{{currencySymbol}}</span>
      <span class="post-view__post-value">{{payoutValue}}
        <dropdown-payout :post="post" :chain="chain"></dropdown-payout>
      </span>
    </span>
    <span class="post-view__post-data-item">
      <a 
        @click.prevent
        class="post-view__post-like" 
        @mouseout="setVoteIsSliding(false)"
        @mouseover="setVoteIsSliding(true)"
        :title="isLike ? $t('comment.removeVote') : $t('comment.like')"
        :class="{'post-view__post-like--active': isLike, 'post-view__post-like--processing': upVoteProcessing}">
        <div class="spinner-rolling"><div></div></div>
        <svg 
          @click.prevent="$emit('vote', true, voteWeight)" 
          class="post-view__icon post-view__icon-like post-view__icon--disabled"
          :class="{'post-view__icon--small': isComment || isBlog}"
        >
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#like"></use>
        </svg>
        <slider v-if="voteSliderActive && !isLike && !post.voteProcessing" :value.sync="voteWeight"></slider>
      </a><span class="post-view__votes" @mouseover="showDropdownsVotes = true">{{likeVotes}}
        <dropdown-votes :post="post" :chain="chain" v-if="likeVotes && showDropdownsVotes" ></dropdown-votes>
      </span>
    </span>
    <span class="post-view__post-data-item" v-if="isComment">
      <a 
        @click.prevent="$emit('vote', false, voteWeight)"
        class="post-view__post-like" 
        :class="{'post-view__post-like--active': isDislike, 'post-view__post-like--processing': downVoteProcessing}" 
        :title="isDislike ? $t('comment.removeVote') : $t('comment.dislike')">
        <div class="spinner-rolling"><div></div></div>
        <svg class="post-view__icon post-view__icon--small post-view__icon-dislike">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#like"></use>
        </svg>
      </a><span>{{dislikeVotes}}</span>
    </span>
    <span class="post-view__post-data-item" v-if="(isPost || isBlog)">
      <a class="post-view__post-reply" :title="$t('common.reply')" @click.prevent="focusToComment" v-scroll-to="'#comment-input-root'">
        <svg 
          class="post-view__icon post-view__icon-comment"
          :class="{'post-view__icon--small': isBlog}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#comment"></use>
        </svg>
      </a><span>{{post.children}}</span>
    </span>
    <a href="#"
      v-if="isComment && replyIsAvailable"
        class="post-view__post-data-item link" 
      :title="$t('common.reply')"
      v-scroll-to="`#comment-input-${post.permlink}`"
      @click.prevent="$emit('reply')">{{$t('common.reply')}}
    </a>
    <a v-if="showEditOption" 
      href="#" 
      class="post-view__post-data-item link" 
      @click.prevent="$emit('edit')"
      :title="$t('common.edit')">
      {{$t('common.edit')}}
    </a>
    <a v-if="showDeleteOption" 
      href="#" 
      class="post-view__post-data-item link" :title="$t('common.delete')" 
      @click.prevent="setRemoveModal(true)">
      {{$t('common.delete')}}
    </a>
    <div class="modal__overlay" v-if="removeModal">
      <div class="modal__dialog" v-on-click-outside="closeRemoveModal">
        <div class="modal__dialog-header">
          <h2 class="h2">{{$t('comment.confirmDeleteComment')}}</h2>
          <span class="modal__close-modal" @click="closeRemoveModal"></span>
        </div>
        <div>
          <button class="btn btn--large modal__confirm-btn" @click.prevent="deleteComment">
            <span v-show="replieDeleteProcessing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
            <span v-show="!replieDeleteProcessing">{{$t('common.delete')}}</span>
          </button>
          <a @click.prevent="closeRemoveModal" href="#" class="modal__btn-link link--ul">{{$t('common.cancel')}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from './Slider.vue'
import CONSTANTS from '@oneplace/constants'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import DropdownPayout from './DropdownPayout.vue'
import DropdownVotes from './DropdownVotes.vue'
import Converter from '@oneplace/blockchains-api/converter'

export default {
  name: 'PostBottom',
  props: [
    'post',
    'account',
    'chain',
    'type',
    'isMaxDeep',
    'upVoteProcessing',
    'downVoteProcessing'
  ],
  mixins: [onClickOutside],
  data() {
    return {
      voteIsSliding: false,
      voteWeight: 10000,
      timerOver: null,
      timerOut: null,
      showDropdownsVotes: false,
      removeModal: false
    }
  },
  components: {
    Slider,
    DropdownPayout,
    DropdownVotes
  },
  methods: {
    deleteComment() {
      this.$store
        .dispatch('deleteComment', {
          chain: this.chain,
          author: this.post.author,
          permlink: this.post.permlink
        })
        .then(() => {
          this.$emit('delete')
        })
    },
    closeRemoveModal() {
      this.setRemoveModal(false)
    },
    setRemoveModal(flag) {
      this.removeModal = flag
    },
    setVoteIsSliding(flag) {
      if (flag) {
        clearTimeout(this.timerOut)
        this.timerOver = setTimeout(() => (this.voteIsSliding = flag), 275)
      } else {
        clearTimeout(this.timerOver)
        this.timerOut = setTimeout(() => (this.voteIsSliding = flag), 0)
      }
    },
    slide(value) {
      this.$store.commit('setVoteWeight', value)
    },
    focusToComment() {
      const commentInputRoot = document.getElementById('comment-input-root')
      if (commentInputRoot) commentInputRoot.focus()
      else this.$emit('focus')
    }
  },
  computed: {
    replyIsAvailable() {
      return (
        !this.isMaxDeep &&
        this.account.username &&
        (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ||
          this.$store.state.postView.post.mode !==
            CONSTANTS.BLOCKCHAIN.MODES.ARCHIVED)
      )
    },
    replieDeleteProcessing() {
      return this.$store.state.postView.replieDeleteProcessing
    },
    showEditOption() {
      const isOwner = this.post.author === this.account.username
      const isGolos = this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
      const isArchived = this.post.mode === CONSTANTS.BLOCKCHAIN.MODES.ARCHIVED
      return !this.isBlog && isOwner && (!isGolos || !isArchived)
    },
    showDeleteOption() {
      return (
        this.isComment &&
        this.showEditOption &&
        (!this.post.replies || !this.post.replies.length) &&
        this.post.net_rshares <= 0
      )
    },
    isLike() {
      return this.account.username
        ? !!this.post.active_votes.find(
            vote =>
              vote.voter === this.account.username &&
              (vote.percent > 0 || vote.weight > 0)
          )
        : false
    },
    isDislike() {
      return this.account.username
        ? !!this.post.active_votes.find(
            vote =>
              vote.voter === this.account.username &&
              (vote.percent < 0 || vote.weight < 0)
          )
        : false
    },
    likeVotes() {
      return this.post.active_votes.filter(
        vote => +vote.weight > 0 || +vote.percent > 0
      ).length
    },
    dislikeVotes() {
      return this.post.active_votes.filter(
        vote => +vote.weight < 0 || +vote.percent < 0
      ).length
    },
    isComment() {
      return this.type === 'comment'
    },
    isBlog() {
      return this.type === 'blog'
    },
    isPost() {
      return this.type === 'post'
    },
    payoutValue() {
      const locale =
        this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ? 'en' : 'ru'
      return this.showPayoutWithVote
        ? this.diffPayouts
        : this.$n(this.post.payout, 'currency', locale).replace(/( ₽)|\$/, '')
    },
    showPayoutWithVote() {
      return (
        this.voteIsSliding &&
        !this.isLike &&
        this.account.username &&
        +this.payoutWithVote !== +this.post.payout &&
        !this.upVoteProcessing
      )
    },
    voteSliderActive() {
      return (
        this.account.username &&
        +this.account.data.vesting_shares.split(' ')[0] > 1e6 &&
        (!this.upVoteProcessing && !this.downVoteProcessing)
      )
    },
    currencySymbol() {
      return this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS ? '₽' : '$'
    },
    diffPayouts() {
      let diff = (this.payoutWithVote - this.post.payout).toFixed(2)
      if (diff > 0) diff = '+' + diff
      return diff
    },
    payoutWithVote() {
      const params = this.$store.state.core.params[this.chain]
      const rshares = Converter.calculateRshares(
        this.chain,
        this.account.data,
        this.voteWeight
      )

      const vote = { rshares, time: new Date().toISOString().split('.')[0] }
      return Converter.voteToFiat(vote, this.chain, params, this.post)
    }
  }
}
</script>
