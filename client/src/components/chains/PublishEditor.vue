<template>
  <textarea :placeholder="$t('publish.typeYourStoryHere')" ref="area"></textarea>
</template>

<script>
import EventBus from '../../event-bus'

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
  name: 'PublishEditor',
  mounted() {
    const SimpleMDE = require('simplemde')
    const generateToolbar = () => {
      return [
        {
          name: 'bold',
          action: SimpleMDE.toggleBold,
          className: 'fa fa-bold',
          title: this.$t('publish.bold')
        },
        {
          name: 'italic',
          action: SimpleMDE.toggleItalic,
          className: 'fa fa-italic',
          title: this.$t('publish.italic')
        },
        {
          name: 'heading',
          action: SimpleMDE.toggleHeadingSmaller,
          className: 'fa fa-header',
          title: this.$t('publish.heading')
        },
        {
          name: 'heading-smaller',
          action: SimpleMDE.toggleHeadingSmaller,
          className: 'fa fa-header fa-header-x fa-header-smaller',
          title: this.$t('publish.headingSmaller')
        },
        {
          name: 'heading-bigger',
          action: SimpleMDE.toggleHeadingBigger,
          className: 'fa fa-header fa-header-x fa-header-bigger',
          title: this.$t('publish.headingBigger')
        },
        '|',
        {
          name: 'code',
          action: SimpleMDE.toggleCodeBlock,
          className: 'fa fa-code',
          title: this.$t('publish.code')
        },
        {
          name: 'quote',
          action: SimpleMDE.toggleBlockquote,
          className: 'fa fa-quote-left',
          title: this.$t('publish.quote')
        },
        {
          name: 'unordered-list',
          action: SimpleMDE.toggleUnorderedList,
          className: 'fa fa-list-ul',
          title: this.$t('publish.unorderedList')
        },
        {
          name: 'ordered-list',
          action: SimpleMDE.toggleOrderedList,
          className: 'fa fa-list-ol',
          title: this.$t('publish.orderedList')
        },
        '|',
        {
          name: 'link',
          action: editor => {
            this.$store.commit('publish/SET_EDITOR_OBJECT', {
              showModalImage: false,
              showModalLink: true
            })
          },
          className: 'fa fa-link',
          title: this.$t('publish.insertLink')
        },
        {
          name: 'image',
          action: editor => {
            this.$store.commit('publish/SET_EDITOR_OBJECT', {
              showModalImage: true,
              showModalLink: false
            })
          },
          className: 'fa fa-picture-o',
          title: this.$t('publish.insertImage')
        },
        {
          name: 'horizontal-rule',
          action: SimpleMDE.drawHorizontalRule,
          className: 'fa fa-minus',
          title: this.$t('publish.horizontalRule')
        },
        '|',
        {
          name: 'side-by-side',
          action: function(editor) {},
          className: 'fa fa-columns no-disable no-mobile d-none',
          title: ''
        },
        {
          name: 'fullscreen',
          action: editor => {
            SimpleMDE.toggleFullScreen(editor)
            if (!this.isFullScreen) SimpleMDE.toggleSideBySide(editor)
            this.isFullScreen = !this.isFullScreen
          },
          className: 'fa fa-columns no-disable no-mobile ',
          title: this.$t('publish.fullscreen')
        },
        '|',
        {
          name: 'guide',
          action: 'https://simplemde.com/markdown-guide',
          className: 'fa fa-question-circle',
          title: this.$t('publish.guide')
        }
      ]
    }
    this.mde = new SimpleMDE({
      autoDownloadFontAwesome: true,
      autofocus: true,
      autosave: { enabled: false },
      blockStyles: {
        bold: '__',
        italic: '_'
      },
      element: this.$refs.area,
      toolbar: generateToolbar(),
      promptURLs: true,
      spellChecker: false,
      status: false,
      styleSelectedText: false
    })

    this.mde.value(this.body)
    this.mde.codemirror.on('cursorActivity', () => {
      const startCursor = this.mde.codemirror.getCursor('start')
      const endCursor = this.mde.codemirror.getCursor('end')
      this.$store.commit('publish/SET_EDITOR_OBJECT', {
        startCursor,
        endCursor
      })
    })

    this.mde.codemirror.on('change', () => {
      this.body = this.mde.value()
    })

    EventBus.$on('LOCALE:CHANGE', lang => {
      const bar = document.getElementsByClassName('editor-toolbar')[0]
      bar.parentNode.removeChild(bar)
      this.mde.createToolbar(generateToolbar())
      // this.mde.codemirror.options.placeholder = this.$t('publish.typeYourStoryHere')
    })
  },
  methods: {
    onUpdate() {
      this.mde.value(this.body)
    }
  },
  computed: {
    body: stateModel('body')
  }
}
</script>
