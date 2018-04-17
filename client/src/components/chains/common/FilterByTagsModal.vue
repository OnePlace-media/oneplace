<template>
  <div class="post-view__overlay">
    <div class="tags-filter__modal" v-on-click-outside="hide">
      <span class="tags-filter__close-modal" @click="hide"></span>
      <div class="tags-filter__modal-header">
        <h3 class="h3">{{$t('profile.allTags')}}</h3>
        <a href="#" 
          class="link tags-filter__clear" 
          :class="{'link--inactive': clearFilterInActive}"
          @click.prevent="clear">
          {{$t('profile.clearFilters')}}
        </a>
      </div>
      <div class="tags-list__wrapper tags-list__wrapper--modal">
        <tag-label 
          v-for="tag in tags" :key="tag.text" 
          :tag="tag"
          :include="include"
          :exclude="exclude"
          @add="add"
          @remove="remove"
        ></tag-label>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import TagLabel from './TagLabel.vue'
export default {
  name: 'FilterByTagsModal',
  components: {
    TagLabel
  },
  props: {
    tags: {
      type: Array,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    },
    include: {
      type: Object,
      required: true
    },
    exclude: {
      type: Object,
      required: true
    },
    clearFilterInActive: {
      type: Boolean,
      required: true
    }
  },
  mixins: [onClickOutside],
  mounted() {
    this.toggleBodyClass({ flag: true })
  },
  beforeDestroy() {
    this.toggleBodyClass({ flag: false })
  },
  methods: {
    toggleBodyClass({ flag }) {
      this.$helper.toggleBodyModalClass({flag})
    },
    hide() {
      this.$emit('update:isShow', false)
    },
    add(tag) {
      this.$emit('add', tag)
    },
    remove(tag) {
      this.$emit('remove', tag)
    },
    clear() {
      this.$emit('clear')
    }
  }
}
</script>

