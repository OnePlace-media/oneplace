<template>
  <section class="tag-block__recent">
    <header class="aside-header">
      <h4 class="h4 aside-header__title">{{$t('common.headers.recentPosts')}}</h4>
    </header>
    <section class="tag-block__recent-body">
      <div class="tag-block__recent-post" v-for="post in posts" :key="post.id">
        <h4 class="h4 tag-block__recent-post-title">
          <a @click.prevent="show(post)" :href="$helper.makePathForPost(post, chain)" class="link" :title="post.title">{{post.title}}</a>
        </h4>
        <div class="tag-block__post-other tag-block__recent-post-other">
          <i18n path="common.timeAgoWithAuthor" tag="p">
            <span class="tag-block__post-time" place="timeago">
              <time-ago :time="post.created"></time-ago>
            </span>
            <router-link 
              tag="a" 
              place="author"
              :to="{name:'chain-account-view', params:{chain: $route.params.chain, username: post.author}}" 
              class="tag-block__post-author link">
              {{post.author}}
            </router-link>
          </i18n>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import EventBus from '../../../event-bus'

export default {
  name: 'TrendTagRecent',
  props: {
    posts: {
      type: Array,
      required: true
    },
    chain: {
      type: String,
      required: true
    }
  },
  methods: {
    show(post) {
      EventBus.$emit('POST:MODAL:SHOW', {
        post: post,
        chain: this.chain
      })
    }
  }
}
</script>
