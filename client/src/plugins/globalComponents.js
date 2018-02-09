const CONSTANTS = require('@oneplace/constants')
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import NoSSR from 'vue-no-ssr'
export default class GlobalDefines {
  static install(Vue) {
    Vue.component('pulse-loader', PulseLoader)
    Vue.component('no-ssr', NoSSR)

    Vue.filter('golosTag', require('./../filters/golos.tag').golosTag)
    Vue.filter('unGolosTag', require('./../filters/golos.tag').unGolosTag)
    Vue.filter('toLowerCase', function(input) {return input.toLowerCase()})
  }
}
