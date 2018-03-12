<template>
  <form class="post-view__reply-block" @submit.prevent="onSubmit" novalidate autocomplete="off">
    <textarea 
      :id="special ? 'comment-input-root' : `comment-input-${post.permlink}`"
      name="body" 
      class="post-view__post-reply-input input" 
      :class="{'post-view__post-reply-input--special': special}"
      :placeholder="$t('common.placeholders.leaveAComment')" 
      v-validate="'required'"
      required
      @change="$emit('change', body)"
      v-model="body"
      ></textarea>
    <div class="post-view__post-btn-group">
      <button class="btn btn--large post-view__post-btn" type="submit" :disabled="processing || errors.any()">
        <span v-show="!processing">{{$t(`comment.${update ? 'update' : 'post'}`)}}</span>
        <span v-show="processing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
      </button>
      <a href="#" class="post-view__post-btn-link" @click.prevent="cancel">{{$t('common.cancel')}}</a>
    </div>
    <div v-if="body">
      <h4 class="h4 post-view__preview-title">{{$t('comment.preview')}}</h4>
      <div class="post-view__reply-preview markdown markdown--small" v-html="preview"></div>
    </div>
  </form>
</template>

<script>
import Vue from 'vue'
import Api from '../../plugins/api'
import Remarkable from 'remarkable'
import CONSTANTS from '@oneplace/constants'
const parser = require('@oneplace/blockchains-api/parser')

const md = new Remarkable({
  html: true,
  breaks: true,
  linkify: false,
  typographer: false,
  quotes: '“”‘’'
})

export default {
  name: 'CommentForm',
  $_veeValidate: {
    validator: 'new'
  },
  props: ['post', 'special', 'update'],
  data() {
    return {
      body: this.update && this.post.body_orig ? this.post.body_orig : '',
      processing: false
    }
  },
  computed: {
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
    },
    preview() {
      return parser.prepareHTML(this.chain, this.body).html // md.render(this.body)
    }
  },
  watch: {
    preview() {
      Vue.nextTick(() => {
        this.$helper.videoWrapperHandler()
      })
    }
  },
  methods: {
    cancel() {
      this.body = ''
      this.$emit('cancel')
    },
    onSubmit() {
      this.processing = true

      const permlink = this.update ? this.post.permlink : ''
      const parentPermlink = this.update
        ? this.post.parent_permlink
        : this.post.permlink
      const parentAuthor = this.update
        ? this.post.parent_author
        : this.post.author
      Api.createComment(
        this.chain,
        this.account.username,
        permlink,
        this.body,
        parentAuthor,
        parentPermlink
      )
        .then(response => {
          this.processing = false
          this.body = ''
          response.data.body = parser.prepareHTML(
            this.chain,
            response.data.body
          ).html
          response.data.total_payout_value = '0'
          this.$emit('success', response.data)
          // fix for v-html with iframe
          this.$helper.videoWrapperHandler()
        })
        .catch(err => {
          this.processing = false
          this.$toast.bottom(this.$t(`errors.${err.response.data.error.code}`))
        })
    }
  }
}
</script>
