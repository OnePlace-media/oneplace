<template>
  <div class="feed__filters" :class="{'feed__filters--fixed': fixed}">
    <header class="feed__filters-header">
      <h4 class="h4 feed__filters-title">
        <svg class="icon--filter">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/filter.svg#icon"></use>
        </svg>
        {{$t('feed.filterByTags')}}
      </h4>
    </header>
    <div class="feed__filters-body" v-if="tags.length">
      <filter-by-tags :tags="tags" @change="change"></filter-by-tags>
    </div>
  </div>
</template>

<script>
const TOP_LIMIT = 10
import FilterByTags from '../../../components/chains/common/FilterByTags.vue'
import EventBus from '../../../event-bus'

export default {
  name: 'FeedFilterByTags',
  components: {
    FilterByTags
  },
  props: {
    tags: {
      type: Array
    }
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
      const blog__header = document.getElementById('blog__header')
      if (blog__header) {
        const bottomBlockTop = blog__header.getBoundingClientRect().top
        this.fixed = elTop <= 70 && bottomBlockTop < 30
      }
    },
    change({ include, exclude }) {
      EventBus.$emit('FEED:FILTER:CHANGE', { include, exclude })
    }
  }
}
</script>
