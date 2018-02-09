<template>
  <div class="login-form">
    <header class="login-form__header login-form__header--large">
      <h2 class="h2 login-form__title">{{$t('addAccount.header',{blockchain: chainName})}}</h2>
    </header>
    <account-form view="add-account" @success="success"></account-form>
  </div>
</template>

<script>
import AccountForm from '../../components/settings/AccountForm/AccountForm.vue'
import Vue from 'vue'

export default {
  name: 'AddAcoount',
  components: {
    AccountForm
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
