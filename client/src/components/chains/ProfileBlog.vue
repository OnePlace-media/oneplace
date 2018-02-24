<template>
  <section class="blog">
    <div class="blog__header">
      <div class="blog__header-tab" :class="{'blog__header-tab--active': withRepost}">
        {{$t('profile.accBlogs',{username: name})}}
      </div>
      <!-- <div class="blog__header-tab" :class="{'blog__header-tab--active': !withRepost}" @click="$emit('update:withRepost', false)">
        {{$t('profile.accountPosts', {username: account.name})}}
      </div> -->
    </div>
    <profile-blog-posts :with-repost="withRepost" :account="account" @show="showPost"></profile-blog-posts>
  </section>
</template>

<script>
import Vue from 'vue'
import ProfileBlogPosts from './ProfileBlogPosts.vue'

export default {
  name: 'ProfileBlog',
  props: {
    account: {
      type: Object,
      required: true
    },
    withRepost: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      postLoading: false
    }
  },
  components: {
    ProfileBlogPosts
  },
  mounted() {
    this.$store.dispatch('core/fetchParams', {
      chain: this.$route.params.chain,
      $chains: this.$chains
    })
  },
  computed: {
    name() {
      const str = this.account.name
      return str.charAt(0).toUpperCase() + str.substr(1, str.length - 1)
    }
  },
  methods: {
    showPost(post) {
      const chain = this.chain
      if (!this.postLoading) {
        this.postLoading = true
        const target = {
          name: 'chain-post-view',
          params: {
            chain: chain,
            username: post.author,
            permlink: post.permlink
          }
        }
        this.$store
          .dispatch('fetchPostByPermlink', {
            chain: chain,
            username: post.author,
            permlink: post.permlink
          })
          .then(() => {
            history.pushState(
              '',
              post.title,
              this.$helper.makePathForPost(post, chain)
            )
            this.$store.commit('core/setRouterFrom', { target })
            this.postLoading = false
          })
      }
    }
  }
}
</script>
