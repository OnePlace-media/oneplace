
export default {
  post(state) {
    return state.postView.post
  },
  postIsLoading(state) {
    return state.postView.processing
  }
}