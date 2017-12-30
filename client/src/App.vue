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
  beforeMount(){
    this.$auth.options.setTransitions.call(this.$auth, this.$route)
  },
  components: {
    AuthCheck
  }
}
</script>

<template>
  <auth-check></auth-check>
</template>