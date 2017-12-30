<template>
  <footer class="footer footer--lite">
    <div class="container footer__wrapper">
      <div class="footer__lang-switch">
        <span class="footer__lang" :class="{'footer__lang--active':$locale.check('en')}" @click="localeChange('en')">English</span>
        <span class="footer__lang" :class="{'footer__lang--active':$locale.check('ru')}" @click="localeChange('ru')">Русский</span>
      </div>
    </div>
  </footer>
</template>

<script>
import Api from '../../plugins/api'
export default {
  methods: {
    localeChange(lang) {
      if (this.$auth.check()) {
        Api.updateUser(this.$auth.user().id, { lang })
      }
      this.$locale.change(lang)
    }
  }
}
</script>
