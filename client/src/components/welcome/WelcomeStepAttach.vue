<template>
  <div class="login-form">
    <header class="login-form__header login-form__header--large">
      <h2 class="h2 login-form__title">{{$t('welcome.attachStep.header')}}</h2>
    </header>
    <account-attach-form view="welcome" @skip="next" @success="next"></account-attach-form>
  </div>
</template>

<script>
import AccountAttachForm from '../settings/AccountAttachForm.vue'
export default {
  name: 'WelcomeStepAttach',
  components: {
    AccountAttachForm
  },
  methods: {
    next({ chain }) {
      this.$router.push({ name: 'welcome-step-tags', params: { chain } })
    }
  }
}
</script>
