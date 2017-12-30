<template>
<header class="login-form__header">
  <router-link :to="{name:'auth-login'}" tag="div" class="login-form__tab" :class="{'login-form__tab--active': $route.name === 'auth-login'}">
    <h3 class="h2 login-form__title">{{$t('auth.SignIn')}}</h3>
  </router-link>
  <router-link :to="{name:'auth-registration'}" tag="div" class="login-form__tab" :class="{'login-form__tab--active': $route.name === 'auth-registration'}">
    <h3 class="h2 login-form__title login-form__title--em">{{$t('auth.CreateAccount')}}</h3>
  </router-link>
</header>
</template>
