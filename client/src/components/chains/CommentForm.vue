<template>
  <form class="post-view__reply-block" @submit.prevent="onSubmit" novalidate>
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
        <span v-show="!processing">{{$t('comment.post')}}</span>
        <span v-show="processing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
      </button>
      <a href="#" class="post-view__post-btn-link" @click.prevent="cancel">{{$t('comment.cancel')}}</a>
    </div>
    <div v-if="body">
      <h4 class="h4 post-view__preview-title">{{$t('comment.preview')}}</h4>
      <div class="post-view__reply-preview markdown markdown--small" v-html="preview"></div>
    </div>
  </form>
</template>

<script>
import Api from '../../plugins/api'
import Remarkable from 'remarkable'

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
  props: ['post', 'special'],
  data() {
    return {
      body: '',
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
      let result = { avatar: '/static/img/avatar.svg', username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    },
    preview() {
      return md.render(this.body)
    }
  },
  methods: {
    cancel() {
      this.body = ''
      this.$emit('cancel')
    },
    onSubmit() {
      this.processing = true
      Api.createComment(
        this.chain,
        this.account.username,
        this.post.permlink,
        this.body,
        this.post.author,
        this.post.permlink
      ).then(response => {
        this.processing = false
        this.body = ''
        this.$emit('success', response.data)
      })
    }
  }
}
</script>
