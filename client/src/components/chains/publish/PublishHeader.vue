<template>
  <no-ssr>
    <header class="publish__header">
      <div class="publish__header-wrapper">
        <div class="publish__post-author">
          <div class="publish__avatar avatar" :style="`background-image: url('${account.avatar || DEFAULT_AVATAR}');`"></div>
          <a 
            class="header__user-switch header__user-switch--publish" 
            title="Switch account" 
            @click.prevent="switchAccount"
            v-if="isNewRecord && accountsByChain.length > 1"
          ></a>
          <div class="column-wrapper">
            <router-link 
              v-if="account.username"
              tag="a" 
              :to="{name:'chain-account-view', params:{chain, username: account.username}}" 
              class="link link--op"
            >
              {{account.username}}
            </router-link>
            <span>{{$t(`publish.${mode}`)}}</span>
          </div>
        </div>
        <div>
          <publish-drafts @update="$emit('update')" v-if="publishDraftsRender"></publish-drafts>
          <publish-options :chain="chain" :account="account"></publish-options>
        </div>
      </div>
    </header>
  </no-ssr>
</template>

<script>
import PublishDrafts from './PublishDrafts.vue'
import PublishOptions from './PublishOptions.vue'

const CONSTANTS = require('@oneplace/constants')
export default {
  name: 'PublishHeader',
  components: {
    PublishDrafts,
    PublishOptions
  },
  props: {
    account: {
      type: Object,
      required: true
    },
    accounts: {
      type: Array,
      required: true
    },
    accountsByChain: {
      type: Array,
      required: true
    },
    chain: {
      type: String,
      required: true
    }
  },
  computed: {
    DEFAULT_AVATAR() {
      return CONSTANTS.DEFAULT.AVATAR_IMAGE
    },
    mode() {
      let mode = 'newPost'
      if (this.$store.state.publish.drafts.loadFromDraft) mode = 'draft'
      if (this.$store.state.publish.form.permlink) mode = 'edit'
      return mode
    },
    isNewRecord() {
      return this.$store.state.publish.form.isNewRecord
    },
    publishDraftsRender() {
      return this.isNewRecord && this.$auth && this.$auth.ready()
    }
  },
  methods: {
    switchAccount($event) {
      this.$store.dispatch('switchAccount', { accounts: this.accounts })
    }
  }
}
</script>
