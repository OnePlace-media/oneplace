<style>
@import url('./assets/css/styles.css');
.login-form__alert {
  display: block;
}
</style>

<script>
import AuthCheck from './components/common/AuthCheck.vue'

export default {
  name: 'App',
  beforeMount() {
    this.$auth.options.setTransitions.call(this.$auth, this.$route)
  },
  components: {
    AuthCheck
  },
  metaInfo() {
    return {
      title: 'Your daily dose of blockchain',
      titleTemplate: '%s | OnePlace.media',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Blockchain aggregator that selects best content from Golos and Steem and delivers it to users with user-friendly and modern interface'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Your daily dose of blockchain | OnePlace.media'
        },
        { vmid: 'og:type', property: 'og:type', content: 'website' },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: `https://oneplace.media${this.$route.path}`
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content: 'https://oneplace.media/static/img/poster.jpeg'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Blockchain aggregator that selects best content from Golos and Steem and delivers it to users with user-friendly and modern interface'
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'OnePlace.media'
        }
      ]
    }
  }
}
</script>

<template>
  <auth-check></auth-check>
</template>