<template>
  <section class="tag-block" :id="`tag-${trend.tag}`">
    <header class="tag-block__header container">
      <h1 class="h1 tag-block__title">{{trend.tag | unGolosTag}}</h1>
    </header>
    <section class="tag-block__body">
      <div class="container" v-if="!trend.posts.length && !processing">
        <p class="tag-block__info">{{$t('chains.emptyCategoryHelp')}}</p>
      </div>
      <div class="container" v-if="trend.posts.length">
        <aside class="tag-block__aside">
          <trend-tag-recent :posts="trend.recentPosts" :chain="chain"></trend-tag-recent>
        </aside>
        <section class="tag-block__trending">
          <trend-tag-article v-for="(post, index) in trend.posts" :key="index" :post="post" :chain="chain"></trend-tag-article>
        </section>
      </div>
    </section>
  </section>
</template>

<script>
import TrendTagArticle from './TrendTagArticle.vue'
import TrendTagRecent from './TrendTagRecent.vue'
export default {
  name: 'TrendTag',
  components: {
    TrendTagArticle,
    TrendTagRecent
  },
  props: {
    trend: {
      type: Object,
      required: true
    },
    chain: {
      type: String,
      required: true
    }
  },
  computed: {
    processing() {
      return this.$store.state.trends.data[this.chain].processing
    }
  }
}
</script>
