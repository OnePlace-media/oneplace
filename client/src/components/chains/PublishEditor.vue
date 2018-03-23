<template>
  <div id="editor-wrapper">
    <textarea :placeholder="$t('publish.typeYourStoryHere')" ref="area"></textarea>

    <div class="publish__toolbar-dropdown" v-if="wrapperShow" v-on-click-outside="closeWrapper" ref="wrapper">
      <span class="publish__toolbar-dropdown-btn" @click.stop="insertWrapper('center')">
        <i class="fa fa-align-center"></i>{{$t('publish.centered')}}
      </span>
      <span class="publish__toolbar-dropdown-btn" @click.stop="insertWrapper('text-justify')">
        <i class="fa fa-align-justify"></i>{{$t('publish.justified')}}
      </span>
      <span class="publish__toolbar-dropdown-btn" @click.stop="insertWrapper('pull-left')">
        <i class="fa fa-pull-left"></i>{{$t('publish.pullLeft')}}
      </span>
      <span class="publish__toolbar-dropdown-btn" @click.stop="insertWrapper('pull-right')">
        <i class="fa fa-pull-right"></i>{{$t('publish.pullRight')}}
      </span>
      <span class="publish__toolbar-dropdown-btn" @click.stop="insertWrapper('indient')">
        <i class="fa fa-indent"></i>{{$t('publish.indient')}}
      </span>
      <span class="publish__toolbar-dropdown-btn" @click.stop="insertWrapper('line')">
        <i class="fa fa-minus"></i>{{$t('publish.insertLine')}}
      </span>
    </div>
  </div>
  
</template>

<script>
import EventBus from '../../event-bus'
import Vue from 'vue'
import { mixin as onClickOutside } from 'vue-on-click-outside'

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
  mixins: [onClickOutside],
  data() {
    return {
      wrapperEl: null,
      wrapperShow: false
    }
  },
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
        {
          id: 'wrapper',
          name: 'wrapper',
          action: editor => {
            this.wrapperShow = true
            Vue.nextTick(() => {
              editor.toolbarElements.wrapper.appendChild(this.$refs.wrapper)
              editor.toolbarElements.wrapper.classList.add(
                'has-dropdown--active'
              )
            })
            this.wrapperEl = editor.toolbarElements.wrapper
          },
          className: 'fa fa-align-left has-dropdown',
          title: this.$t('publish.wrapper')
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
        '|',
        {
          name: 'preview',
          action: editor => {
            SimpleMDE.togglePreview(editor)
            const elemList = document.getElementsByClassName('editor-preview')
            if (elemList.length) {
              elemList[0].classList.add('markdown')
            }
          },
          className: 'fa fa-eye no-disable',
          title: this.$t('publish.togglePreview')
        },
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
            const elemList = document.getElementsByClassName(
              'editor-preview-side'
            )
            if (elemList.length) {
              Vue.nextTick(() => {
                const className = 'editor-preview-active-side'
                if (!elemList[0].classList.contains(className))
                  SimpleMDE.toggleSideBySide(editor)
              })
              elemList[0].classList.add('markdown')
            }
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
      dragDrop: true,
      autoDownloadFontAwesome: false,
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
    })

    EventBus.$on('EDITOR:INSERT:LINK', ({ link, isImage = false }) => {
      const selections = this.mde.codemirror.getSelections()
      let selectionsReplace
      const template = `${isImage ? '!' : ''}[%NAME%](${link})`
      selectionsReplace = selections.map(selection =>
        template.replace('%NAME%', selection || link)
      )
      this.mde.codemirror.replaceSelections(selectionsReplace)
    })

    Vue.nextTick(() => {
      const elements = document.getElementsByClassName('CodeMirror-scroll')
      if (elements.length) {
        const div = document.createElement('DIV')
        div.id = 'drag-zone'
        elements[0].appendChild(div)
        div.addEventListener('drop', this.onDrop)
        div.addEventListener('dragleave', this.onDragLeave)
      }
    })

    this.mde.codemirror.on('dragenter', this.onDragEnter)
  },
  destroyed() {
    const div = document.getElementById('drag-zone')
    div.removeEventListener('drop', this.onDrop)
    div.removeEventListener('dragleave', this.onDragLeave)
  },
  methods: {
    onDrop($event) {
      this.onDragLeave($event)
      if ($event.dataTransfer.items) {
        const i = 0
        if ($event.dataTransfer.items[i].kind === 'file') {
          const file = $event.dataTransfer.items[i].getAsFile()
          this.$store.commit('publish/SET_EDITOR_OBJECT', {
            showModalImage: true,
            showModalLink: false
          })
          Vue.nextTick(() => {
            EventBus.$emit('EDITOR:UPLOAD', { file })
          })
        }
      }
    },
    onDragLeave($event) {
      const div = document.getElementById('drag-zone')
      div.classList.remove('drag-zone-visible')
      div.classList.remove('drop-image')
    },
    onDragEnter($event) {
      const div = document.getElementById('drag-zone')
      div.classList.add('drag-zone-visible')
      div.classList.add('drop-image')
    },
    onUpdate() {
      this.mde.value(this.body)
    },
    closeWrapper() {
      this.wrapperShow = false
      if (this.wrapperEl)
        this.wrapperEl.classList.remove('has-dropdown--active')
    },
    insertWrapper(type) {
      let tag = 'div'
      let className = null
      if (type === 'center') tag = 'center'
      else className = type

      const selections = this.mde.codemirror.getSelections()
      let selectionsReplace
      if (type === 'indient') {
        const template = `&#8195;`
        const start = this.mde.codemirror.getCursor('start')
        start.ch = 0
        this.mde.codemirror.replaceRange(template, start, start)
      } else {
        if (type === 'line') {
          const template = `\n\n-----\n\n`
          selectionsReplace = selections.map(selection => selection + template)
        } else {
          const template = `<${tag}${
            className ? ` class="${className}"` : ''
          }>%CONTENT%</${tag}>`
          selectionsReplace = selections.map(selection =>
            template.replace('%CONTENT%', selection)
          )
        }
        this.mde.codemirror.replaceSelections(selectionsReplace)
      }
      this.closeWrapper()
    }
  },
  computed: {
    body: stateModel('body')
  }
}
</script>

<style>
#drag-zone {
  position: absolute;
  width: 100%;
  height: 96%;
  z-index: 99999999999999999;
  display: none;
  top: 0;
  left: 0;
}

#drag-zone.drop-image {
  border: 1px dotted #cfd2d2;
}

.drag-zone-visible {
  display: block !important;
}
</style>
