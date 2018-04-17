<style>
@import '~simplemde/dist/simplemde.min.css';
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
    this.$metaGenerator.app(this.$route)
  }
}
</script>

<template>
  <auth-check></auth-check>
</template>