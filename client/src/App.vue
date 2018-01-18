<style>
@import url('../static/css/styles.css');
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
    const TITLE = 'Your daily dose of blockchain'
    const DESCRIPTION =
      'Blockchain aggregator that selects best content from Golos and Steem and delivers it to users with user-friendly and modern interface'
    const IMAGE = 'https://oneplace.media/static/img/poster.jpeg'
    return {
      title: TITLE,
      titleTemplate: '%s | OnePlace.media',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: DESCRIPTION
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: `${TITLE} | OnePlace.media`
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
          content: IMAGE
        },
        {
          vmid: 'og:image:width',
          property: 'og:image:width',
          content: '840'
        },
        {
          vmid: 'og:image:height',
          property: 'og:image:height',
          content: '362'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: DESCRIPTION
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'OnePlace.media'
        },
        {
          vmid: 'twitter:image',
          name: 'twitter:image',
          content: IMAGE
        },
        {
          vmid: 'twitter:card',
          name: 'twitter:site',
          content: '@oneplace.media'
        },
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: `${TITLE} | OnePlace.media`
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content: DESCRIPTION
        }
      ]
    }
  }
}
</script>

<template>
  <auth-check></auth-check>
</template>