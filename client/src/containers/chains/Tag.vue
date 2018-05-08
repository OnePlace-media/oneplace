<template>
  <section class="main-content">
    <section class="tag-block">
      <header class="tag-block__header container">
        <h1 class="h1 tag-block__title">{{tag | unGolosTag}}</h1>
      </header>
      <section class="tag-block__body">
        <div class="container" v-if="!posts.length">
          <p class="tag-block__info">{{$t('chains.emptyCategoryHelp')}}</p>
        </div>
        <div class="container" v-if="posts.length">
          <section class="tag-block__trending">
            <article class="tag-block__top-post" v-for="(post, index) in posts" :key="index">
              <a 
                v-if="!post.nsfw || post.nsfw === 'show'"
                :href="$helper.makePathForPost(post, chain)"
                class="tag-block__post-image" 
                :style="`background-image:url('${post.image}');`"
                :title="post.title" 
              >
                <img class="image--mobile" :src="post.image">
              </a>

              <a 
                v-if="post.nsfw && post.nsfw !== 'show'"
                @click.prevent="post.nsfw = 'show'" href="#"
                class="tag-block__post-image"
              >
                <a class="nsfw-image">{{$t('chains.imageIsHidden')}}</a>
              </a>

              <div class="tag-block__top-post-info">
                <h3 class="h3 tag-block__top-post-title">
                  <a :href="$helper.makePathForPost(post, chain)" class="link" :title="post.title">
                    <span class="nsfw-warning" v-if="post.nsfw">nsfw</span>{{post.title}}
                  </a>
                </h3>
                <p class="tag-block__top-post-text">
                  <a :href="$helper.makePathForPost(post, chain)" class="link">{{post.preview}}</a>
                </p>
                <div class="tag-block__top-post-other tag-block__post-other">
                  <router-link 
                    tag="a" 
                    :to="{name:'chain-account-view', params:{chain, username: post.author}}" 
                    :style="`background-image: url('${post.avatar || DEFAULT_AVATAR}');`"
                    class="tag-block__post-avatar avatar">
                  </router-link>
                  <div class="tag-block__post-data">
                    <span class="tag-block__post-value">{{currencySymbol}}&nbsp;<span :class="{'payout-declined': post.payout_declined}">{{post.payout}}</span></span>
                    <a :href="$helper.makePathForPost(post, chain)" class="tag-block__post-replies link">
                      <svg class="tag-block__icon-comment">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#comment"></use>
                      </svg>&nbsp;&nbsp;{{post.children}}</a>
                  </div>
                  <router-link 
                    tag="a" 
                    :to="{name:'chain-account-view', params:{chain, username: post.author}}" 
                    class="post-view__author-link link link--op">
                    {{post.author}}
                  </router-link>
                  <!-- <a :href="`/${$route.params.chain}/@${post.author}`" class="post-view__author-link link link--op">
                    {{post.author}}
                  </a> -->
                  <br>
                  <span class="tag-block__post-time">
                    <time-ago :time="post.created"></time-ago>
                  </span>
                </div>
              </div>
            </article>
          </section>
          <aside class="tag-block__aside">
            <section class="tag-block__recent">
              <header class="aside-header">
                <h4 class="h4 aside-header__title">{{$t('common.headers.recentPosts')}}</h4>
              </header>
              <section class="tag-block__recent-body">
                <div class="tag-block__recent-post" v-for="post in recentPosts" :key="post.id">
                  <h4 class="h4 tag-block__recent-post-title">
                    <a :href="$helper.makePathForPost(post, chain)" class="link" :title="post.title">{{post.title}}</a>
                  </h4>
                  <div class="tag-block__post-other tag-block__recent-post-other">
                    <i18n path="common.timeAgoWithAuthor" tag="p">
                      <span class="tag-block__post-time" place="timeago">
                        <time-ago :time="post.created"></time-ago>
                      </span>
                      <router-link 
                        tag="a" 
                        place="author"
                        :to="{name:'chain-account-view', params:{chain, username: post.author}}" 
                        class="tag-block__post-author link">
                        {{post.author}}
                      </router-link>
                    </i18n>
                  </div>
                </div>
              </section>
            </section>
          </aside>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
const CONSTANTS = require('@oneplace/constants')
import Api from '../../plugins/api'
import { mapState, mapActions } from 'vuex'
import VueScrollTo from 'vue-scrollto'

export default {
  name: 'Tag',
  asyncData({ store, route, router }) {
    return store
      .dispatch('tag/fetchTagData', {
        chain: route.params.chain,
        tag: route.params.tag
      })
      .catch(err => {
        if (err.response && err.response.status === 500) {
          store.commit('set404Page', true)
        }
      })
  },
  metaInfo() {
    return this.$metaGenerator.tag(this.tag, this.$route, this.chainName)
  },
  computed: {
    DEFAULT_AVATAR() {
      return CONSTANTS.DEFAULT.AVATAR_IMAGE
    },
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
    tag() {
      return this.$store.state.tag.tag
    },
    posts() {
      return this.$store.state.tag.trend.posts
    },
    recentPosts() {
      return this.$store.state.tag.trend.recentPosts
    },
    created() {
      return this.formatTime(this.post.created)
    }
  },
  methods: {
    formatTime(time) {
      const d = new Date(time)
      return d.toLocaleString()
    }
  }
}
</script>