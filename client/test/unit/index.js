import VeeValidate from 'vee-validate'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {createLocalVue} from 'vue-test-utils'
import VueI18n from 'vue-i18n'
import Helper from '@/plugins/helper'

require('es6-promise').polyfill()
const localVue = createLocalVue()

localVue.config.productionTip = false
localVue.use(VeeValidate, {inject: false})
localVue.use(VueAxios, axios)
localVue.use(VueI18n)
localVue.use(Helper)

// require all test files (files that ends with .spec.js)
const specs = [
  // 'containers/home.spec',
  'containers/auth/login.spec',
  'containers/auth/registration.spec'
]

specs.forEach(path => {
  require(`./specs/${path}`)(localVue)
})

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.

const srcContext = require.context('../../src', true, /^\.\/(?!(app|entry-client|entry-server)(\.js)?$)/)
srcContext.keys().forEach(srcContext)