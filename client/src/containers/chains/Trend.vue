<template>
  <section class="main-content" v-if="$auth && $auth.ready()">
    <no-ssr v-for="(trend, index) in trends.data[chain].collection" :key="index">
      <section class="tag-block" :id="`tag-${trend.tag}`">
        <header class="tag-block__header container">
          <h1 class="h1 tag-block__title">{{trend.tag | unGolosTag}}</h1>
        </header>
        <section class="tag-block__body">
          <div class="container" v-if="!trend.posts.length && !processing">
            <p class="tag-block__info">{{$t('chains.emptyCategoryHelp')}}</p>
          </div>
          <div class="container" v-if="trend.posts.length">
            <section class="tag-block__trending">
              <article class="tag-block__top-post" v-for="(post, index) in trend.posts" :key="index">
                <a 
                  v-if="!post.nsfw || post.nsfw === 'show'"
                  @click.prevent="showPost(post)" :href="makePath(post)"
                  class="tag-block__post-image" :class="{'tag-block__secondary-post-image': index > 0, 'tag-block__primary-post-image': !index}" 
                 :style="`background:url('${post.image}') 50% 0 no-repeat transparent;`" 
                >
                  <img class="image--mobile" :src="post.image">
                </a>

                <a 
                  v-if="post.nsfw && post.nsfw !== 'show'"
                  @click.prevent="post.nsfw = 'show'" href="#"
                  class="tag-block__post-image" :class="{'tag-block__secondary-post-image': index > 0, 'tag-block__primary-post-image': !index}"
                >
                  <a class="nsfw-image">{{$t('chains.imageIsHidden')}}.</a>
                </a>

                <div class="tag-block__top-post-info">
                  <h3 class="h3 tag-block__top-post-title">
                    <a @click.prevent="showPost(post)" :href="makePath(post)" class="link">
                      <span class="nsfw-warning" v-if="post.nsfw">nsfw</span>{{post.title}}
                    </a>
                  </h3>
                  <p class="tag-block__top-post-text">
                    <a @click.prevent="showPost(post)" :href="makePath(post)" class="link">{{post.preview}}</a>
                  </p>
                  <div class="tag-block__top-post-other tag-block__post-other">
                    <a :href="`/${$route.params.chain}/@${post.author}`" class="tag-block__post-avatar avatar" 
                      :style="`background-image: url('${post.avatar || '/static/img/avatar.svg'}');`"></a>
                    <div class="tag-block__post-data">
                      <span class="tag-block__post-value" :class="{'payout-declined': post.payout_declined}">{{currencySymbol}}&nbsp;{{post.payout}}</span>
                      <a @click.prevent="showPost(post)" :href="makePath(post)" class="tag-block__post-replies link">
                        <svg class="tag-block__icon-comment">
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#comment"></use>
                        </svg>&nbsp;&nbsp;{{post.children}}</a>
                    </div>
                    <a class="tag-block__post-author link" :href="`/${$route.params.chain}/@${post.author}`">{{post.author}}</a>
                    <br>
                    <span class="tag-block__post-time">
                      <timeago :since="post.created" :locale="$locale.current()" :format="formatTime"></timeago>
                    </span>
                  </div>
                </div>
              </article>
            </section>
            <aside class="tag-block__aside">
              <section class="tag-block__recent">
                <header class="tag-block__recent-header">
                  <h4 class="h4 tag-block__recent-heading">{{$t('common.headers.recentPosts')}}</h4>
                </header>
                <section class="tag-block__recent-body">
                  <div class="tag-block__recent-post" v-for="post in trend.recentPosts" :key="post.id">
                    <h4 class="h4 tag-block__recent-post-heading">
                      <a @click.prevent="showPost(post)" :href="makePath(post)" class="link">{{post.title}}</a>
                    </h4>
                    <div class="tag-block__post-other tag-block__recent-post-other">
                      <i18n path="common.timeAgoWithAuthor" tag="p">
                        <span class="tag-block__post-time" place="timeago">
                          <timeago :since="post.created" :locale="$locale.current()"></timeago>
                        </span>
                        <a place="author" :href="`/${$route.params.chain}/@${post.author}`" class="tag-block__post-author link">{{post.author}}</a>
                      </i18n>
                    </div>
                  </div>
                </section>
              </section>
            </aside>
          </div>
        </section>
      </section>
    </no-ssr>
    <center><pulse-loader :loading="processing" :color="'#383838'" :size="'10px'"></pulse-loader></center>
  </section>
</template>

<script>
const CONSTANTS = require('@oneplace/constants')
import Api from '../../plugins/api'
import { mapState, mapActions } from 'vuex'
import VueScrollTo from 'vue-scrollto'

export default {
  name: 'Trend',
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
    currencySymbol() {
      return this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS ? '₽' : '$'
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
  data() {
    return {
      postLoading: false
    }
  },
  methods: {
    formatTime(time) {
      const d = new Date(time)
      return d.toLocaleString()
    },
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
    makePath(post) {
      return `/${this.chain}/@${post.author}/${post.permlink}`
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
    },
    showPost(post) {
      if (!this.postLoading) {
        this.postLoading = true
        const target = {
          name: 'chain-post-view',
          params: {
            chain: this.chain,
            username: post.author,
            permlink: post.permlink
          }
        }
        this.$store
          .dispatch('fetchPostByPermlink', {
            chain: this.chain,
            username: post.author,
            permlink: post.permlink
          })
          .then(() => {
            history.pushState('', post.title, this.makePath(post))
            this.$store.commit('setRouterFrom', { target })
            this.postLoading = false
          })
      }
    }
  }
}
</script>