<template>
  <div class="login-form">
    <header class="login-form__header login-form__header--large">
      <h2 class="h2 login-form__title">{{$t('welcome.confirmStep.header')}}</h2>
    </header>
    <account-confirm-form :chain="chain" view="welcome" @skip="next" @success="next"></account-confirm-form>
  </div>
</template>

<script>
import AccountConfirmForm from '../../components/settings/AccountConfirmForm.vue'
export default {
  name: 'WelcomeStepConfirm',
  components: {
    AccountConfirmForm
  },
  computed: {
    chain() {
      return this.$route.params.chain
    }
  },
  methods: {
    next({ chain }) {
      this.$router.push({ name: 'welcome-step-tags', params: { chain } })
    }
  }
}
</script>
