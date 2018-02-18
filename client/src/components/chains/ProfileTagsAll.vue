<template>
  <div class="post-view__overlay" v-if="show">
    <div class="tags-filter__modal">
      <span class="tags-filter__close-modal" @click="hideAllTags"></span>
      <div class="tags-filter__modal-header">
        <h3 class="h3">{{$t('profile.allTags')}}</h3>
        <a href="#" class="link tags-filter__clear" @click.prevent="clearTagsFilter">{{$t('profile.clearFilters')}}</a>
      </div>
      <div class="tags-list__wrapper">
        <span 
          v-for="tag in tags" :key="tag.text"
          @click.stop="select(tag)"
          class="tags-list__item tags-list__item--filter"
          :class="{'tags-list__item--selected': $store.state.profile.tags.include[tag.text], 'tags-list__item--removed': $store.state.profile.tags.exclude[tag.text]}">
          {{tag.text | unGolosTag | toLowerCase}}
          <span class="tags-list__remove-item" :alt="$t('profile.removeTag')" @click.stop="remove(tag)"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileTagsAll',
  computed: {
    show() {
      return this.$store.state.profile.tags.showAllTags
    },
    tags() {
      return this.$store.state.profile.tags.collection
    }
  },
  methods: {
    hideAllTags() {
      this.$store.commit('profile/SET_SHOW_ALL_TAGS', false)
    },
    select(tag) {
      this.$store.commit('profile/SELECT_TAG', { tag })
    },
    remove(tag) {
      this.$store.commit('profile/REMOVE_TAG', { tag })
    },
    clearTagsFilter(){
      this.$store.commit('profile/CLEAR_TAGS_FILTER')
    }
  }
}
</script>

