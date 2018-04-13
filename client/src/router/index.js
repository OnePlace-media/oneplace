import Vue from 'vue'
import Router from 'vue-router'

import MainLayout from '../containers/layouts/Main.vue'
import AuthLayout from '../containers/layouts/Auth.vue'
import WrapperLayout from '../containers/layouts/Wrapper.vue'


// import Welcome from '../containers/welcome/Welcome.vue'
import WelcomeSteps from '../containers/welcome/WelcomeSteps.vue'
import WelcomeStepAttach from '../components/welcome/WelcomeStepAttach.vue'
import WelcomeStepConfirm from '../components/welcome/WelcomeStepConfirm.vue'
import WelcomeStepTags from '../components/welcome/WelcomeStepTags.vue'

import AccountAdd from '../containers/chains/AccountAdd.vue'
import AccountConfirm from '../containers/chains/AccountConfirm.vue'

import NotFound from '../containers/NotFound.vue'
import Settings from '../containers/settings/Settings.vue'
import Publish from '../containers/chains/Publish.vue'

Vue.use(Router)
const CONSTANTS = require('@oneplace/constants')
export function createRouter(i18n) {
  return new Router({
    mode: 'history',
    routes: [
      require('../containers/auth/auth.routes').default,
      // {
      //   path: '/welcome',
      //   component: AuthLayout,
      //   children: [
      //     {
      //       name: 'welcome',
      //       path: '',
      //       component: Welcome,
      //       meta: {
      //         auth: true
      //       }
      //     }
      //   ]
      // },
      {
        path: '/welcome',
        component: AuthLayout,
        children: [
          {
            name: 'welcome-steps',
            path: '',
            component: WelcomeSteps,
            redirect: 'step/attach',
            meta: {
              auth: true
            },
            children: [
              {
                name: 'welcome-step-attach',
                path: 'step/attach',
                component: WelcomeStepAttach
              },
              {
                name: 'welcome-step-confirm',
                path: 'step/:chain/confirm/',
                component: WelcomeStepConfirm
              },
              {
                name: 'welcome-step-tags',
                path: 'step/:chain/tags/',
                component: WelcomeStepTags
              }
            ]
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
            component: AccountAdd,
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: `/:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/confirm-account`,
        component: AuthLayout,
        children: [
          {
            name: 'confirm-account',
            path: '',
            component: AccountConfirm,
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: `/:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/publish`,
        component: WrapperLayout,
        children: [
          {
            name: 'publish',
            path: '',
            component: Publish,
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: `/:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/@:username/:permlink/edit`,
        component: WrapperLayout,
        children: [
          {
            name: 'post-edit',
            path: '',
            component: Publish,
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: '/',
        component: MainLayout,
        redirect: '/s',
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