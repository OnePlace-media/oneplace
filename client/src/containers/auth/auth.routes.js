import AuthLayout from '../layouts/Auth.vue'

export default {
  path: '/auth',
  component: AuthLayout,
  children: [
    {
      name: 'auth-login',
      path: '',
      component: require('./Login.vue').default
    },
    {
      name: 'auth-registration',
      path: 'registration',
      component: require('./Registration.vue').default
    },
    {
      name: 'auth-recovery',
      path: 'recovery',
      component: require('./Recovery.vue').default
    },
    {
      name: 'auth-reset',
      path: 'reset/:accessToken/:uid',
      component: require('./Reset.vue').default
    },
    {
      name: 'auth-token',
      path: 'token/:accessToken/:uid',
      component: require('./Token.vue').default
    }
  ]
}
