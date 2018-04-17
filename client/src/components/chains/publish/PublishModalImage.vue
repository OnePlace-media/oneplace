<template>
  <div class="modal__overlay">
    <div class="modal__dialog publish__modal" v-on-click-outside="close">
      <div class="publish__modal-header">
        <h3 class="h3">{{$t('publish.insertImage')}}</h3>
        <span class="modal__close-modal" @click.stop="close"></span>
      </div>
      <div class="publish__upload-wrapper">
        <input type="text" class="publish__link-input input" 
          :placeholder="$t('publish.pasteImageLinkOrUploadImageFromYourDevice')" 
          name="link" 
          v-model="link">
        <input 
          type="file" 
          class="publish__file-input input" 
          name="image" 
          id="image-file" 
          v-on:change="uploadImage"
          :accept="accept.join(',')"
        >
        <label for="image-file" class="publish__file-input-label">
          <span v-show="!processing">{{$t('publish.upload')}}</span>
          <div class="spinner" v-show="processing">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </label>
        <span class="publish__upload-alert" v-show="errorCode">{{$t(`publish.errors.${errorCode}`)}}</span>
      </div>
      <div class="publish__modal-bottom">
        <button 
          class="btn publish__image-insert-btn" 
          :class="{'publish__image-insert-btn--active': !disabled}" 
          @click="onSubmit" 
          :disabled="disabled">
          {{$t('publish.insertImage')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import EventBus from '../../../event-bus'
import Api from '../../../plugins/api'

export default {
  name: 'PublishModalImage',
  mixins: [onClickOutside],
  data() {
    return {
      link: '',
      name: '',
      errorCode: null,
      processing: false
    }
  },
  mounted() {
    EventBus.$on('EDITOR:UPLOAD', this.upload)
  },
  destroyed() {
    EventBus.$off('EDITOR:UPLOAD', this.upload)
  },
  computed: {
    disabled() {
      return !this.link
    },
    accept() {
      return ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
  },
  methods: {
    upload({ file }) {
      this.uploadImage({ target: { files: [file] } })
    },
    close() {
      this.$store.commit('publish/SET_EDITOR_OBJECT', { showModalImage: false })
    },
    uploadImage($event) {
      const file = $event.target.files[0]
      this.errorCode = null
      if (file) {
        if (~this.accept.indexOf(file.type)) {
          this.processing = true
          Api.uploadImage(file)
            .then(response => {
              this.name = file.name
              this.link = [
                window.location.origin,
                'storage',
                response.data.relPath
              ].join('/')

              this.processing = false
            })
            .catch(err => {
              if (err.response && err.response.data.error) {
                this.errorCode = err.response.data.error.code
              }
              this.processing = false
            })
        } else {
          this.errorCode = 'SUPPORT'
        }
      }
    },
    onSubmit() {
      EventBus.$emit('EDITOR:INSERT:LINK', {
        name: this.name,
        link: this.link,
        isImage: true
      })
      this.$store.commit('publish/SET_EDITOR_OBJECT', { showModalImage: false })
    }
  }
}
</script>
