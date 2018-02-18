<template>
  <div class="profile__tags-filter">
    <h4 class="h4 tags-filter__title">{{$t('profile.topTags')}}</h4>
    <div class="tags-list__wrapper">
      <span 
        v-for="tag in tagsTop" :key="tag.text"
        @click.stop="select(tag)"
        class="tags-list__item tags-list__item--filter" 
        :class="{'tags-list__item--selected': $store.state.profile.tags.include[tag.text], 'tags-list__item--removed': $store.state.profile.tags.exclude[tag.text]}">
        {{tag.text | unGolosTag | toLowerCase}}
        <span class="tags-list__remove-item" @click.stop="remove(tag)" :alt="$t('profile.removeTag')"></span>
      </span>
    </div>
    <div class="profile__tags-more">
      <a href="#" class="link" @click.prevent="showAllTags">{{$t('profile.showAllTags')}}</a>
      <a href="#" class="link" @click.prevent="clearTagsFilter">{{$t('profile.clearFilters')}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileTopTags',
  methods: {
    showAllTags() {
      this.$store.commit('profile/SET_SHOW_ALL_TAGS', true)
    },
    select(tag) {
      this.$store.commit('profile/SELECT_TAG', { tag })
    },
    remove(tag) {
      this.$store.commit('profile/REMOVE_TAG', { tag })
    },
    clearTagsFilter() {
      this.$store.commit('profile/CLEAR_TAGS_FILTER')
    }
  },
  computed: {
    tagsTop() {
      return this.$store.state.profile.tags.collection.slice(0, 10)
    }
  }
}
</script>
