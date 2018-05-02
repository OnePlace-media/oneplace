<template>
  <div>
    <div class="tags-filter__spinner" style="display:none;">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
    <div class="tags-list__wrapper">
      <tag-label 
        v-for="tag in tagsTop" :key="tag.text" 
        :tag="tag"
        @add="add"
        @remove="remove"
        ></tag-label>
    </div>
    <div class="profile__tags-more">
      <a 
        href="#" 
        class="link"
        :class="{'link--inactive': clearFilterInActive}"
        @click.prevent="clear">
        {{$t('profile.clearFilters')}}
      </a>
      <a href="#" class="link" @click.prevent="showAllTags" v-if="showAllTagsBtn">{{$t('profile.showAllTags')}}</a>
    </div>
  </div>
</template>

<script>
import TagLabel from './TagLabel.vue'
const TOP_LIMIT = 10
export default {
  name: 'FilterByTags',
  components: {
    TagLabel
  },
  props: {
    tags: {
      type: Array,
      required: true
    }
  },
  methods: {
    change() {
      this.$emit('change', { include: this.include, exclude: this.exclude })
    },
    clear() {
      this.$store.commit('filterByTags/CLEAR_FILTERS')
      this.change()
    },
    showAllTags() {
      this.$store.commit('filterByTags/SET_MODAL_SHOW', true)
    },
    add(tag) {
      this.$store.commit('filterByTags/ADD_TAG', tag)
      this.change()
    },
    remove(tag) {
      this.$store.commit('filterByTags/REMOVE_TAG', tag)
      this.change()
    }
  },
  computed: {
    clearFilterInActive() {
      const includes = Object.keys(this.include).length
      const excludes = Object.keys(this.exclude).length
      return !(includes || excludes)
    },
    showAllTagsBtn() {
      return this.tags.length > TOP_LIMIT
    },
    tagsTop() {
      return this.tags.slice(0, TOP_LIMIT)
    },
    include() {
      return this.$store.state.filterByTags.include
    },
    exclude() {
      return this.$store.state.filterByTags.exclude
    },
    modalShow() {
      return this.$store.state.filterByTags.modalShow
    }
  }
}
</script>
