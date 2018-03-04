const CONSTANTS = require('@oneplace/constants')
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import NoSSR from 'vue-no-ssr'
import TimeAgo from './../components/common/TimeAgo.vue'

export default class GlobalDefines {
  static install(Vue) {
    Vue.component('pulse-loader', PulseLoader)
    Vue.component('no-ssr', NoSSR)
    Vue.component('time-ago', TimeAgo)

    Vue.filter('golosTag', require('./../filters/golos.tag').golosTag)
    Vue.filter('unGolosTag', require('./../filters/golos.tag').unGolosTag)
    Vue.filter('toLowerCase', function(input) {return input.toLowerCase()})
  }
}
