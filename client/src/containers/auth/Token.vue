<script>
import Vue from 'vue'
export default {
  name: 'Auth-Token',
  beforeMount() {
    Vue.localStorage.set('default_auth_token', this.$route.params.accessToken)
    this.$cookie.set('rememberMe', 'true', 1)
    this.$auth.token(null, this.$route.params.accessToken)
    this.$auth.refresh({
      success: () => {
        this.$auth.authenticated = true
        this.goToNext()
      },
      error: () => {
        this.goToNext()
      }
    })
  },
  methods: {
    goToNext() {
      const target = this.$route.query.reset
        ? { name: 'chain-trend', params: { chain: 's' } }
        : { name: 'welcome' }

      if (this.$auth.ready()) {
        this.$router.push(target)
      } else {
        this.$auth.ready(() => {
          this.$router.push(target)
        })
      }
    }
  }
}
</script>
<template>
  <div>TOKEN</div>
</template>
