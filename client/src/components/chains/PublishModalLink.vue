<template>
  <div class="modal__overlay">
    <div class="modal__dialog publish__modal" v-on-click-outside="close">
      <div class="publish__modal-header">
        <h3 class="h3">{{$t('publish.insertLink')}}</h3>
        <span class="modal__close-modal" @click.stop="close"></span>
      </div>
      <div class="publish__upload-wrapper">
        <input type="text" class="publish__link-input input" v-model="link" :placeholder="$t('publish.pasteLinkUrlHere')" name="link">
      </div>
      <div class="publish__modal-bottom">
        <button 
          class="btn publish__image-insert-btn" 
          :class="{'publish__image-insert-btn--active': !disabled}" 
          @click="onSubmit" 
          :disabled="disabled">
          {{$t('publish.insertLink')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import EventBus from '../../event-bus'

export default {
  name: 'PublishModalLink',
  mixins: [onClickOutside],
  data() {
    return {
      link: ''
    }
  },
  computed: {
    disabled() {
      return !this.link
    }
  },
  methods: {
    close() {
      this.$store.commit('publish/SET_EDITOR_OBJECT', { showModalLink: false })
    },
    onSubmit() {
      const content = `[${this.link}](${this.link})`
      EventBus.$emit('EDITOR:INSERT', { content })
      this.$store.commit('publish/SET_EDITOR_OBJECT', { showModalLink: false })
    }
  }
}
</script>