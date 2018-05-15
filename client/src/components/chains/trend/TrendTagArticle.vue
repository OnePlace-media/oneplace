<template>
  <article class="tag-block__top-post">
    <a 
        v-if="!post.nsfw || post.nsfw === 'show'"
        @click.prevent="show()" :href="$helper.makePathForPost(post, chain)"
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
        <a @click.prevent="show()" :href="$helper.makePathForPost(post, chain)" class="link" :title="post.title">
            <span class="nsfw-warning" v-if="post.nsfw">nsfw</span>{{post.title}}
        </a>
        </h3>
        <p class="tag-block__top-post-text">
        <a @click.prevent="show()" :href="$helper.makePathForPost(post, chain)" class="link">{{post.preview}}</a>
        </p>
        <div class="tag-block__top-post-other tag-block__post-other">
        <router-link 
            tag="a" 
            :to="{name:'chain-account-view', params:{chain: $route.params.chain, username: post.author}}" 
            :style="`background-image: url('${post.avatar || DEFAULT_AVATAR}');`"
            class="tag-block__post-avatar avatar">
        </router-link>
        <div class="tag-block__post-data">
            <span class="tag-block__post-value">
              <span class="tag-block__post-currency">{{currencySymbol}}</span>
              <span :class="{'payout-declined': post.payout_declined}">{{payoutValue}}</span>
            </span>
            <a @click.prevent="focusComment()" :href="$helper.makePathForPost(post, chain)" class="tag-block__post-replies link">
              <svg class="tag-block__icon-comment">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#comment"></use>
              </svg>{{post.children}}
            </a>
        </div>
        <router-link 
            tag="a" 
            :to="{name:'chain-account-view', params:{chain: $route.params.chain, username: post.author}}" 
            class="post-view__author-link link link--op">
            {{post.author}}
        </router-link>
        <br>
        <span class="tag-block__post-time">
            <time-ago :time="post.created"></time-ago>
        </span>
        </div>
    </div>
    </article>
</template>

<script>
import CONSTANTS from '@oneplace/constants'
import EventBus from '../../../event-bus'

export default {
  name: 'TrendTagArticle',
  props: {
    post: {
      type: Object,
      required: true
    },
    chain: {
      type: String,
      required: true
    }
  },
  computed: {
    DEFAULT_AVATAR() {
      return CONSTANTS.DEFAULT.AVATAR_IMAGE
    },
    currencySymbol() {
      return this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS ? '₽' : '$'
    },
    payoutValue() {
      const locale = this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM ? 'en' : 'ru'
      return this.$n(this.post.payout, 'currency', locale).replace(/( ₽)|\$/, '')
    }
  },
  methods: {
    show() {
      EventBus.$emit('POST:MODAL:SHOW', {
        post: this.post,
        chain: this.chain
      })
    },
    focusComment() {
      EventBus.$emit('POST:MODAL:FOCUS_COMMENT', {
        post: this.post,
        chain: this.chain
      })
    }
  }
}
</script>
