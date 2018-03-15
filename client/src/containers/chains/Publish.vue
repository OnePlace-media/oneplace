<template>
  <div class="main-content publish">
    <publish-header 
      :accounts="accounts"
      :accounts-by-chain="accountsByChain"
      :account="account" 
      :chain="chain"
      @update="onUpdate"
    ></publish-header>

    <section class="publish__post-editor" v-on:drop="onDrop">
      <textarea class="publish__input-title input" :placeholder="$t('publish.enterPostTitle')" v-model="title" ref="title" maxlength="256"></textarea>
      <publish-editor ref='editor'></publish-editor>
    </section>
    <publish-modal-image v-if="showModalImage" @update="onUpdate"></publish-modal-image>
    <publish-modal-link v-if="showModalLink" @update="onUpdate"></publish-modal-link>
    <footer-mini></footer-mini>
  </div>
</template>

<style>
.d-none {
  display: none !important;
}
</style>

<script>
import PublishHeader from '../../components/chains/PublishHeader.vue'
import PublishEditor from '../../components/chains/PublishEditor.vue'

import PublishModalLink from '../../components/chains/PublishModalLink.vue'
import PublishModalImage from '../../components/chains/PublishModalImage.vue'

import FooterMini from '../../components/common/FooterMini.vue'

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
  methods: {
    onDrop($event) {
      for (let i = 0; i < $event.dataTransfer.items.length; i++) {
        if ($event.dataTransfer.items[i].kind === 'file') {
          const file = $event.dataTransfer.items[i].getAsFile()
          console.log('... file[' + i + '].name = ' + file.name)
        }
      }
    },
    onUpdate() {
      this.$refs.editor.onUpdate()
    }
  },
  watch: {
    title(to, from) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = "bold 32px 'Noto Sans', sans-serif"
      const metrics = context.measureText(to)
      const q = Math.floor(metrics.width / 830) + 1
      this.$refs.title.style.height = q * 48 + 'px'
    }
  },
  computed: {
    title: stateModel('title'),
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
