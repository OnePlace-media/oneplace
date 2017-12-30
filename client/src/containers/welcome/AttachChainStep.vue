<template>
  <div class="login-form">
    <header class="login-form__header login-form__header--large">
      <h2 class="h2 login-form__title">{{$t('welcome.attachChainStep.header')}}</h2>
    </header>
    <account-form view="welcome" @skip="$emit('skip')"></account-form>
  </div>
</template>

<script>
import AccountForm from '../../components/settings/AccountForm/AccountForm.vue'
export default {
  name: 'AttachChainStep',
  components: {
    AccountForm
  }
}
</script>
