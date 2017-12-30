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
        this.$auth.ready(()=>{
          this.$router.push({ name: 'welcome' })
        })

      },
      error: () => {
        this.$router.push({ name: 'welcome' })
      }
    })
  }
}
</script>
<template>
  <div>TOKEN</div>
</template>
