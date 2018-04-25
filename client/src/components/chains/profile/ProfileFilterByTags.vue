<template>
  <div class="profile__tags-filter" :class="{'profile__tags-filter--fixed': fixed}" v-show="tags.length">
    <h4 class="h4 tags-filter__title">{{$t('profile.topTags')}}</h4>
    <filter-by-tags :tags="tags" @change="change"></filter-by-tags>
  </div>
</template>

<script>
const TOP_LIMIT = 10
import FilterByTags from '../../../components/chains/common/FilterByTags.vue'
import EventBus from '../../../event-bus'
const parser = require('@oneplace/blockchains-api/parser')
export default {
  name: 'ProfileFilterByTags',
  components: {
    FilterByTags
  },
  data() {
    return {
      fixed: false
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
    change({ include, exclude }) {
      EventBus.$emit('PROFILE:FILTER:CHANGE', { include, exclude })
    }
  },
  computed: {
    tags() {
      const posts = this.$store.state.profile.posts.collection
      const tags = parser.getTagsFromPosts(posts)
      tags.sort((a, b) => b.count - a.count)
      return tags
    }
  }
}
</script>
