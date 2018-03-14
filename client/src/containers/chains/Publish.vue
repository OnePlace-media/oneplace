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
      <textarea :placeholder="$t('publish.typeYourStoryHere')" ref="area"></textarea>
    </section>
  </div>
</template>

<style>
.d-none {
  display: none !important;
}
</style>

<script>
import PublishHeader from '../../components/chains/PublishHeader.vue'

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
    PublishHeader
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
      this.mde.value(this.body)
    }
  },
  mounted() {
    const SimpleMDE = require('simplemde')

    this.mde = new SimpleMDE({
      autoDownloadFontAwesome: true,
      autofocus: true,
      autosave: { enabled: false },
      blockStyles: {
        bold: '__',
        italic: '_'
      },
      element: this.$refs.area,
      toolbar: [
        'bold',
        'italic',
        'heading',
        'heading-smaller',
        'heading-bigger',
        '|',
        'code',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        'horizontal-rule',
        '|',
        {
          name: 'side-by-side',
          action: function(editor) {},
          className: 'fa fa-columns no-disable no-mobile d-none',
          title: 'Toggle Side by Side'
        },
        {
          name: 'fullscreen',
          action: editor => {
            SimpleMDE.toggleFullScreen(editor)
            if (!this.isFullScreen) SimpleMDE.toggleSideBySide(editor)
            this.isFullScreen = !this.isFullScreen
          },
          className: 'fa fa-columns no-disable no-mobile ',
          title: 'Toggle Fullscreen'
        },
        '|',
        'guide'
      ],
      promptURLs: true,
      spellChecker: false,
      status: false,
      styleSelectedText: false
    })

    this.mde.value(this.body)
    this.mde.codemirror.on('change', () => {
      this.body = this.mde.value()
    })
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
    body: stateModel('body'),
    title: stateModel('title'),
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
