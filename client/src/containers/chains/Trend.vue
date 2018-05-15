<template>
  <section class="main-content" v-if="$auth && $auth.ready()">
    <no-ssr v-for="(trend, index) in trends.data[chain].collection" :key="index">
      <trend-tag :trend="trend" :chain="chain"></trend-tag>
    </no-ssr>
    <no-ssr>
      <center><pulse-loader :loading="processing" :color="'#383838'" :size="'10px'"></pulse-loader></center>
    </no-ssr>
  </section>
</template>

<script>
const CONSTANTS = require('@oneplace/constants')
import Api from '../../plugins/api'
import { mapState, mapActions } from 'vuex'
import VueScrollTo from 'vue-scrollto'
import TrendTag from '../../components/chains/trend/TrendTag.vue'

export default {
  name: 'Trend',
  components:{
    TrendTag
  },
  metaInfo() {
    return {
      title: `${this.chainName} trends`
    }
  },
  watch: {
    $route(to, from) {
      if (to.params.chain !== from.params.chain) {
        this.$store.commit('clearTrends')
        this.fetchData()
        window.scrollTo(0, 0)
      }
    }
  },
  beforeMount() {
    if (this.$auth.ready()) this.fetchData()
    else this.$auth.ready(() => this.fetchData())
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy() {
    this.$store.commit('clearTrends')
    window.removeEventListener('scroll', this.scrollHandler)
  },
  computed: {
    ...mapState(['trends']),
    chain() {
      return this.$route.params.chain
    },
    chainName() {
      return {
        s: 'Steem',
        g: 'Golos'
      }[this.chain]
    },
    processing() {
      return this.$store.state.trends.data[this.chain].processing
    },
    tags() {
      const _tags = (this.$auth.check() && this.$auth.user().tags
        ? this.$auth.user().tags
        : []
      ).filter(tag => tag.chain === this.$route.params.chain)
      return _tags.length
        ? _tags
        : CONSTANTS.DEFAULT.TAGS[this.$route.params.chain]
    }
  },
  methods: {
    scrollHandler(init = false) {
      if (this.tags) {
        const tag = this.tags.find(tag => {
          const tagSection = document.querySelector(`#tag-${tag.text}`)
          if (tagSection) {
            const topPos = tagSection.getBoundingClientRect().top
            return (
              (topPos > 0 && topPos < (init ? 150 : 100)) ||
              (topPos < 0 && topPos > -600)
            )
          } else {
            return false
          }
        })
        if (tag) {
          this.$store.commit('setTrendsActiveTag', tag.text)
        }
      }
    },
    fetchData() {
      this.$store
        .dispatch('fetchTrends', {
          chain: this.$route.params.chain,
          tags: this.tags
        })
        .then(() => {
          this.scrollHandler(true)
        })
    }
  }
}
</script>