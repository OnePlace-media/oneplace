export default class AsyncData {
  static install(Vue, {store}) {
    Vue.mixin({
      beforeRouteUpdate(to, from, next) {
        const {asyncData} = this.$options
        if (asyncData) {
          asyncData({
            store: store,
            route: to
          })
        }
        next()
      },
      beforeMount() {
        const {asyncData} = this.$options
        if (asyncData) {
          this.dataPromise = asyncData({
            store: store,
            route: this.$route
          })
        }
      }
    })
  }
}
