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
        if (this.$route.meta && this.$route.meta.auth && !this.$auth.check()) {
          this.$router.replace(this.$auth.options.authRedirect.path)
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
