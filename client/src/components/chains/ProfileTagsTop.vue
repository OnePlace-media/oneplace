<template>
  <div class="profile__tags-filter" :class="{'profile__tags-filter--fixed': fixed}" v-show="tagsTop.length">
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
      <a 
        href="#" 
        class="link"
        :class="{'link--inactive': clearFilterInActive}"
        @click.prevent="clearTagsFilter">
        {{$t('profile.clearFilters')}}
      </a>
      <a href="#" class="link" @click.prevent="showAllTags" v-if="showAllTagsBtn">{{$t('profile.showAllTags')}}</a>
    </div>
  </div>
</template>

<script>
const TOP_LIMIT = 10
export default {
  name: 'ProfileTopTags',
  data() {
    return {
      fixed: false
    }
  },
  props: {
    withRepost: {
      type: Boolean,
      required: true
    },
    clearFilterInActive: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    scrollHandler() {
      const elTop = this.$el.getBoundingClientRect().top
      const bottomBlockTop = document
        .getElementById('profile__bottom-block')
        .getBoundingClientRect().top
      this.fixed =
        this.$el.getBoundingClientRect().top <= 70 && bottomBlockTop < -70
    },
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
    tags() {
      return this.withRepost
        ? this.$store.state.profile.tags.collection
        : this.$store.state.profile.tags.collection.filter(tag => tag.owner)
    },
    tagsTop() {
      return this.tags.slice(0, TOP_LIMIT)
    },
    showAllTagsBtn() {
      return this.tags.length > TOP_LIMIT
    }
  }
}
</script>
