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
    }
  },
  mixins: [onClickOutside],
  mounted() {
    this.toggleBodyClass({ flag: true })
  },
  beforeDestroy() {
    this.toggleBodyClass({ flag: false })
  },
  computed:{
    clearFilterInActive() {
      const includes = Object.keys(this.include).length
      const excludes = Object.keys(this.exclude).length
      return !(includes || excludes)
    },
    include(){
      return this.$store.state.filterByTags.include
    },
    exclude(){
      return this.$store.state.filterByTags.exclude
    },
    isShow(){
      return this.$store.state.filterByTags.modalShow
    }
  },
  methods: {
    change() {
      this.$emit('change', { include: this.include, exclude: this.exclude })
    },
    toggleBodyClass({ flag }) {
      this.$helper.toggleBodyModalClass({flag})
    },
    hide() {
     this.$store.commit('filterByTags/SET_MODAL_SHOW', false)
    },
    add(tag) {
      this.$store.commit('filterByTags/ADD_TAG', tag)
      this.change()
    },
    remove(tag) {
      this.$store.commit('filterByTags/REMOVE_TAG', tag)
      this.change()
    },
    clear() {
      this.$store.commit('filterByTags/CLEAR_FILTERS')
      this.change()
    }
  }
}
</script>

