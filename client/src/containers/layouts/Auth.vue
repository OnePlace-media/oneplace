<script>
import FooterMini from '../../components/common/FooterMini.vue'
export default {
  name: 'AuthLayout',
  components: {
    FooterMini
  }
}
</script>

<template>
  <div id="app" class="wrapper">
    <div class="login__wrapper">
      <router-link :to="{name:'chain-trend', params:{chain:$route.params.chain || 's'}}" tag="div" class="login__logo">
        <img src="/static/img/logo.svg" alt="OnePlace" class="img-responsive">
      </router-link>
      <router-view></router-view>
    </div>
    <footer-mini></footer-mini>
  </div>
</template>

<style>
.login__logo {
  cursor: pointer;
}

.login-form__body > .overlay {
  margin-top: -30px;
}
</style>
