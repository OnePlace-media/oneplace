<script>
import NoSSR from 'vue-no-ssr'
import Api from '../../plugins/api'
export default {
  name: 'FooterBar',
  components: {
    'no-ssr': NoSSR
  },
  methods: {
    localeChange(lang) {
      if (this.$auth.check()) {
        Api.updateUser(this.$auth.user().id, { lang })
      }
      this.$locale.change(lang)
    }
  },
  computed:{
    chain() {
      return this.$route.params.chain || this.$store.state.chain || 's'
    }
  }
}
</script>

<template>
  <footer class="footer">
    <div class="container footer__wrapper">
      <i18n path="footer.createdBy" tag="div" class="footer__license">
        <router-link 
          place="link"
          tag="a"
          target="_blank"
          :to="{name:'chain-account-view', params:{chain, username: 'oneplace'}}" 
          class="link link--op">
          oneplace.media
        </router-link>
      </i18n>
      <no-ssr>
        <div class="footer__lang-switch">
          {{$t('footer.language')}}: 
          <span class="footer__lang" :class="{'footer__lang--active':$locale.check('en')}" @click="localeChange('en')">English</span>
          <span class="footer__lang" :class="{'footer__lang--active':$locale.check('ru')}" @click="localeChange('ru')">Русский</span>
        </div>
      </no-ssr>
    </div>
  </footer>
</template>
