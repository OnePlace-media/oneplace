<template>
  <section class="blog">
    <div class="blog__header">
      <div class="blog__header-tab blog__header-tab--active">
        {{$t('profile.accBlogs',{username: name})}}
      </div>
    </div>
    <profile-blog-posts :account="account"></profile-blog-posts>
  </section>
</template>

<script>
import Vue from 'vue'
import ProfileBlogPosts from './ProfileBlogPosts.vue'
import EventBus from '../../../event-bus'

export default {
  name: 'ProfileBlog',
  props: {
    account: {
      type: Object,
      required: true
    },
    chain: {
      type: String,
      default() {
        return this.$route.params.chain
      }
    }
  },
  components: {
    ProfileBlogPosts
  },
  mounted() {
    this.$store.dispatch('core/fetchParams', {
      chain: this.chain,
      $chains: this.$chains
    })
  },
  computed: {
    name() {
      const str = this.account.name
      return str.charAt(0).toUpperCase() + str.substr(1, str.length - 1)
    }
  }
}
</script>
