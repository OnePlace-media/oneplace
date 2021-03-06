<template>
  <div class="main-content publish" v-show="!processing">
    <publish-header 
      :accounts="accounts"
      :accounts-by-chain="accountsByChain"
      :account="account" 
      :chain="chain"
      @update="onUpdate"
    ></publish-header>

    <section class="publish__post-editor">
      <textarea class="publish__input-title input" :placeholder="$t('publish.enterPostTitle')" v-model="title" ref="title" maxlength="256"></textarea>
      <publish-editor ref='editor' :chain="chain"></publish-editor>
    </section>
    <publish-modal-image v-if="showModalImage" @update="onUpdate"></publish-modal-image>
    <publish-modal-link v-if="showModalLink" @update="onUpdate"></publish-modal-link>
  </div>
</template>

<style>
.d-none {
  display: none !important;
}
</style>

<script>
import PublishHeader from '../../components/chains/publish/PublishHeader.vue'
import PublishEditor from '../../components/chains/publish/PublishEditor.vue'

import PublishModalLink from '../../components/chains/publish/PublishModalLink.vue'
import PublishModalImage from '../../components/chains/publish/PublishModalImage.vue'

import FooterMini from '../../components/common/FooterMini.vue'
import Vue from 'vue';

const CONSTANTS = require('@oneplace/constants')
const stateModel = name => {
  return {
    get() {
      return this.$store.state.publish.form[name]
    },
    set(value) {
      this.$store.commit('publish/SET_FORM_OBJECT', { [name]: value })
    }
  }
}
export default {
  name: 'Publish',
  data() {
    return {
      isFullScreen: false
    }
  },
  components: {
    PublishHeader,
    PublishEditor,
    PublishModalLink,
    PublishModalImage,
    FooterMini
  },
  mounted() {
    const init = () => {
      try {
        if (this.account.username === null) throw new Error('ACCESS_DENIED')
        else {
          const username = this.$route.params.username
          if (username) {
            const accounts = this.accountsByChain
            const account = accounts.find(acc => acc.username === username)
            if (!account) throw new Error('ACCESS_DENIED')
            else
              this.$store.dispatch('switchAccount', {
                accounts,
                targetAccId: account.id
              })
          }
          this.$store.dispatch('publish/init', this.$route.params).then(() => {
            this.onUpdate()
            setTimeout(()=>{
              this.onUpdate()
              this.updateTitleHeight()
            }, 0)
          })
        }
      } catch (e) {
        this.$router.push({
          name: 'add-account',
          params: { chain: this.chain }
        })
      }
    }

    this.$auth.ready() ? init() : this.$auth.ready(init)
  },
  metaInfo() {
    return {
      title: `Publish to ${this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ? 'STEEM' : 'GOLOS'}`
    }
  },
  methods: {
    onUpdate() {
      this.$refs.editor.onUpdate()
    },
    updateTitleHeight(value){
      value = value || this.title
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = "bold 32px 'Noto Sans', sans-serif"
      const metrics = context.measureText(value)
      const q = Math.floor(metrics.width / 830) + 1
      this.$refs.title.style.height = q * 48 + 'px'
    }
  },
  watch: {
    title(to, from) {
      this.updateTitleHeight(to)
    }
  },
  computed: {
    processing() {
      return this.$store.state.publish.processing
    },
    title: stateModel('title'),
    body: stateModel('body'),
    showModalImage() {
      return this.$store.state.publish.editor.showModalImage
    },
    showModalLink() {
      return this.$store.state.publish.editor.showModalLink
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
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    }
  }
}
</script>
