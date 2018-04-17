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
        :include="include"
        :exclude="exclude"
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
    <filter-by-tags-modal
      v-if="modalShow"
      :tags="tags"
      :is-show.sync="modalShow"
      :include="include"
      :exclude="exclude"
      :clear-filter-in-active="clearFilterInActive"
      @add="add"
      @remove="remove"
      @clear="clear"
    ></filter-by-tags-modal>
  </div>
</template>

<script>
import TagLabel from './TagLabel.vue'
import FilterByTagsModal from './FilterByTagsModal.vue'
const TOP_LIMIT = 10
export default {
  name: 'FilterByTags',
  components: {
    TagLabel,
    FilterByTagsModal
  },
  data() {
    return {
      fixed: false,
      modalShow: false,
      include: {},
      exclude: {}
    }
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
      this.include = {}
      this.exclude = {}
      this.change()
    },
    showAllTags() {
      this.modalShow = true
    },
    add(tag) {
      if (!this.exclude[tag.text]) {
        if (this.include[tag.text]) this.$delete(this.include, tag.text)
        else this.$set(this.include, tag.text, true)
      }
      this.$delete(this.exclude, tag.text)
      this.change()
    },
    remove(tag) {
      this.$set(this.exclude, tag.text, true)
      this.$delete(this.include, tag.text)
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
    }
  }
}
</script>
