<template>
  <div class="login-form">
    <header class="login-form__header login-form__header--large">
      <h2 class="h2 login-form__title">{{$t('addAccount.header',{blockchain: chainName})}}</h2>
    </header>
    <account-attach-form view="add-account" @success="success"></account-attach-form>
  </div>
</template>

<script>
import AccountAttachForm from '../../components/settings/AccountAttachForm.vue'

export default {
  name: 'AcoountAdd',
  components: {
    AccountAttachForm
  },
  computed: {
    chainName() {
      return {
        s: 'Steem',
        g: 'Golos'
      }[this.$route.params.chain]
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
