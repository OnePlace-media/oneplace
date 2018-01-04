import Vue from "vue"
import {createApp} from './app'
Vue.prototype.$auth = null

export default context => {
  return new Promise((resolve, reject) => {
    const {app, router, store} = createApp(context)
    router.push(context.url)
    context.meta = app.$meta()
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
        // После разрешения всех preFetch хуков, наше хранилище теперь
        // заполнено состоянием, необходимым для рендеринга приложения.
        // Когда мы присоединяем состояние к контексту, и есть опция `template`
        // используемая для рендерера, состояние будет автоматически
        // сериализовано и внедрено в HTML как `window.__INITIAL_STATE__`.
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}