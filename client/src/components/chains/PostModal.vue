<template>
  <div class="post-view__overlay" v-if="!processing">
    <div class="post-view__modal">
      <post-view v-on-click-outside="close" v-if="post" :is-modal="true"></post-view>
      <comments-wrapper :post="post" v-if="post"></comments-wrapper>
    </div>
  </div>
</template>

<script>
import PostView from './PostView.vue'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import CommentsWrapper from './CommentsWrapper.vue'
const KEY_CODE_ESC = 27
export default {
  name: 'PostModal',
  components: {
    PostView,
    CommentsWrapper
  },
  mixins: [onClickOutside],
  mounted() {
    document.body.classList.add('modal-shown')
    window.addEventListener('keyup', this.keyUpHandler)
    window.addEventListener('popstate', this.popstateHandler)
  },
  beforeDestroy() {
    document.body.classList.remove('modal-shown')
    window.removeEventListener('keyup', this.keyUpHandler)
    window.removeEventListener('popstate', this.popstateHandler)
  },
  methods: {
    popstateHandler() {
      this.$store.commit('setPostViewData', null)
    },
    keyUpHandler(event) {
      if (event.keyCode === KEY_CODE_ESC) {
        this.close()
      }
    },
    close($event) {
      function findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el
      }
      if (!findAncestor($event.target, 'post-view__overlay')) {
        history.go(-1)
        this.$store.commit('setPostViewData', null)
      }
    }
  },
  computed: {
    post() {
      return this.$store.state.postView.post
    },
    processing() {
      return this.$store.state.postView.processing
    }
  }
}
</script>
