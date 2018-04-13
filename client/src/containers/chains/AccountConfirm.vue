<template>
  <div class="login-form">
    <header class="login-form__header login-form__header--large">
      <h2 class="h2 login-form__title">{{$t('welcome.confirmStep.header')}}</h2>
    </header>
    <account-confirm-form view="add-account" @success="success" :chain="chain"></account-confirm-form>
  </div>
</template>

<script>
import AccountConfirmForm from '../../components/settings/AccountConfirmForm.vue'
export default {
  name: 'AcoountAdd',
  components: {
    AccountConfirmForm
  },
  computed: {
    chain() {
      return this.$route.params.chain
    },
    chainName() {
      return {
        s: 'Steem',
        g: 'Golos'
      }[this.chain]
    }
  },
  methods: {
    success() {
      this.$auth.fetch()
      const target = {
        name: 'chain-trend',
        params: { chain: this.$route.params.chain }
      }
      const from = this.$store.state.core.$router.from
      if (from) {
        target.name = from.name
        target.params = from.params
      }
      this.$router.push(target)
    }
  }
}
</script>
