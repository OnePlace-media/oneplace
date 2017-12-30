import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '../containers/layouts/Main.vue'
import AuthLayout from '../containers/layouts/Auth.vue'
import Welcome from '../containers/welcome/Welcome.vue'
import AddAccount from '../containers/chains/AddAccount.vue'
import NotFound from '../containers/NotFound.vue'
import Settings from '../containers/settings/Settings.vue'
Vue.use(Router)
const CONSTANTS = require('@oneplace/constants')
export function createRouter(i18n) {
  return new Router({
    mode: 'history',
    routes: [
      require('../containers/auth/auth.routes').default,
      {
        path: '/welcome',
        component: AuthLayout,
        children: [
          {
            name: 'welcome',
            path: '',
            component: Welcome,
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: `/:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/add-account`,
        component: AuthLayout,
        children: [
          {
            name: 'add-account',
            path: '',
            component: AddAccount,
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: '/',
        component: MainLayout,
        redirect: '/g',
        children: [{
          name: 'settings',
          path: 'settings',
          meta: {
            auth: true
          },
          component: Settings
        }]
          .concat(require('../containers/chains/chains.routes').default)
      },
      {
        path: '*',
        component: AuthLayout,
        children: [
          {
            name: 'not-found',
            path: '',
            component: NotFound
          }
        ]
      }

    ]
  })
}