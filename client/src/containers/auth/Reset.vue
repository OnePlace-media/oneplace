<script>
import Vue from 'vue'
export default {
  name: 'Auth-reset',
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      model: {
        password: ''
      },
      passwordRepeat: '',
      formSubmitted: false,
      processing: false,
      formSuccessSubmitted: false,
      formFailSubmitted: false
    }
  },
  methods: {
    checkRepeatPass() {
      if (this.model.password === this.passwordRepeat) {
        this.errors.remove('passwordRepeat')
      } else {
        this.errors.add({
          field: 'passwordRepeat',
          msg: 'Password must repeat',
          rule: 'repeat',
          id: 'repeat'
        })
      }
    },
    onSubmit() {
      if (!this.processing) {
        this.processing = true
        this.wrongCredentials = false
        this.$validator
          .validateAll()
          .then(() => {
            this.checkRepeatPass()
            if (this.errors.any()) throw new Error('INVALID_FORM')
            this.formSubmitted = true
            return this.axios.patch(
              `users/${this.$route.params.uid}?redirect=${encodeURIComponent(
                window.location.origin
              )}`,
              this.model,
              {
                headers: {
                  Authorization: this.$route.params.accessToken
                }
              }
            )
          })
          .then(response => {
            this.processing = false
            this.formSuccessSubmitted = true
            setTimeout(() => {
              Vue.nextTick(() =>
                this.$router.push({
                  name: 'chain-trend',
                  params: { chain: 's' }
                })
              )
            }, 5000)
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 422) {
                this.$helper.handleValidationError(
                  err.response.data.error,
                  this.errors
                )
              } else {
                this.formFailSubmitted = true
              }
            }
            this.processing = false
          })
      }
    }
  }
}
</script>

<template>
<div class="login-form" v-if="!formSuccessSubmitted && !formFailSubmitted">
  <header class="login-form__header login-form__header--large">
    <h2 class="h2 login-form__title">{{$t('auth.reset.header')}}</h2>
  </header>
  <form class="login-form__body" @submit.prevent="onSubmit" novalidate autocomplete="off">
    <p class="login-form__text">{{$t('auth.reset.help')}}:</p>
    <div class="login-form__item">
      <input autocomplete="off" v-model="model.password" v-validate="'required'" name="password" type="password" :placeholder="$t('common.placeholders.password')" class="login-form__input" :class="{'login-form__input--error':errors.has('password')}">
      <div v-show="errors.firstByRule('password', 'required')" id="vError-password-required" class="login-form__alert">{{$t('common.validate.passwordRequired')}}</div>
    </div>
    <div class="login-form__item">
      <input autocomplete="off" v-model="passwordRepeat" v-validate="'required'" name="passwordRepeat" type="password" :placeholder="$t('common.placeholders.passwordRepeat')" class="login-form__input" :class="{'login-form__input--error':errors.has('passwordRepeat')}">
      <div v-show="errors.firstByRule('passwordRepeat', 'repeat')" id="vError-password-repeat" class="login-form__alert">{{$t('common.validate.passwordRepeat')}}</div>
    </div>
    <button type="submit" class="btn login-form__btn btn--large" :disabled="processing">{{$t('auth.ChangePassword')}}</button>
  </form>
</div>

<div class="login-form" v-else-if="formSuccessSubmitted">
  <header class="login-form__header login-form__header--large">
    <h2 class="h2 login-form__title">{{$t('auth.reset.success.header')}}</h2>
  </header>
  <div class="login-form__body">
    <p class="login-form__text">{{$t('auth.reset.success.body')}}</p>
  </div>
</div>

<div class="login-form" v-else-if="formFailSubmitted">
  <header class="login-form__header login-form__header--large">
    <h2 class="h2 login-form__title">{{$t('auth.reset.fail.header')}}</h2>
  </header>
  <div class="login-form__body">
    <i18n path="auth.reset.fail.body" tag="p" class="login-form__text">
      <router-link place="action" :to="{name:'auth-recovery'}" class="link">{{ $t('auth.reset.fail.action') }}</router-link>
    </i18n>
  </div>
</div>
</template>
