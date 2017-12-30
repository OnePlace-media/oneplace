<script>
import Vue from 'vue'
export default {
  name: 'AuthCheck',
  data() {
    return {
      ready: false
    }
  },
  beforeMount() {
    this.$auth.refresh({
      success: () => {
        this.handleRedirect()
      },
      error: () => {
        this.handleRedirect()
      }
    })
  },
  methods: {
    handleRedirect() {
      this.$auth.options.checkAuthenticated.call(this.$auth, () => {
        if (this.$route.meta && this.$route.meta.auth) {
          if (this.$auth.check()) {
            // console.log('You are authorized')
          } else {
            // console.log('You are not authorized')
            this.$router.replace(this.$auth.options.authRedirect.path)
          }
        } else {
          // console.log('No need to check auth')
        }
        this.ready = true
      })
    }
  }
}
</script>
<template>
  <router-view v-show="ready"></router-view>
</template>
