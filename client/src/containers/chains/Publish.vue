<template>
  <div class="main-content publish">
    <publish-header 
      :accounts="accounts"
      :accounts-by-chain="accountsByChain"
      :account="account" 
      :chain="chain"
    ></publish-header>

    <section class="publish__post-editor">
      <textarea class="publish__input-title input" :placeholder="$t('publish.enterPostTitle')" v-model="title"></textarea>
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
        {
          name: 'bold',
          action: SimpleMDE.toggleBold,
          className: 'fa fa-bold',
          title: 'Bold'
        },
        {
          name: 'italic',
          action: SimpleMDE.toggleItalic,
          className: 'fa fa-italic',
          title: 'Italic'
        },
        {
          name: 'heading',
          action: SimpleMDE.toggleHeadingSmaller,
          className: 'fa fa-header',
          title: 'Heading'
        },
        {
          name: 'heading-smaller',
          action: SimpleMDE.toggleHeadingSmaller,
          className: 'fa fa-header fa-header-x fa-header-smaller',
          title: 'Smaller Heading'
        },
        {
          name: 'heading-bigger',
          action: SimpleMDE.toggleHeadingBigger,
          className: 'fa fa-header fa-header-x fa-header-bigger',
          title: 'Bigger Heading'
        },
        '|', // Separator
        {
          name: 'code',
          action: SimpleMDE.toggleCodeBlock,
          className: 'fa fa-code',
          title: 'Code'
        },
        {
          name: 'quote',
          action: SimpleMDE.toggleBlockquote,
          className: 'fa fa-quote-left',
          title: 'Quote'
        },
        {
          name: 'unordered-list',
          action: SimpleMDE.toggleUnorderedList,
          className: 'fa fa-list-ul',
          title: 'Generic List'
        },
        {
          name: 'ordered-list',
          action: SimpleMDE.toggleOrderedList,
          className: 'fa fa-list-ol',
          title: 'Numbered List'
        },
        '|', // Separator
        {
          name: 'link',
          action: SimpleMDE.drawLink,
          className: 'fa fa-link',
          title: 'Create Link'
        },
        {
          name: 'image',
          action: SimpleMDE.drawImage,
          className: 'fa fa-picture-o',
          title: 'Insert Image'
        },
        {
          name: 'horizontal-rule',
          action: SimpleMDE.drawHorizontalRule,
          className: 'fa fa-minus',
          title: 'Insert Horizontal Line'
        },
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
        {
          name: 'guide',
          action: "https://simplemde.com/markdown-guide",
          className: 'fa fa-question-circle',
          title: 'Markdown Guide'
        }
      ],
      promptURLs: true,
      spellChecker: false,
      status: false,
      styleSelectedText: false
    })

    this.mde.value(this.value)
    this.mde.codemirror.on('change', () => {
      this.body = this.mde.value()
    })
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
