import Vue from "vue"
import {createApp} from './app'
Vue.prototype.$auth = null

export default context => {
  return new Promise((resolve, reject) => {
    const {app, router, store} = createApp(context)
    context.meta = app.$meta()
    router.push(context.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({code: 404})
      }

      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute,
            router
          })
        }
      })).then(() => {
        context.meta = app.$meta()
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}