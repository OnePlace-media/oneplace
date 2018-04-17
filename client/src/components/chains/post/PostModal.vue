<template>
  <div class="post-view" v-if="showPostModal">
    <div class="post-view__spinner" v-show="processing"><img src="/static/img/spinner-dark.gif" alt=""></div>
    <div class="post-view__overlay" v-if="!processing" id="post-overlay">
      <post-share v-if="post"></post-share>
      <div class="post-view__modal">
        <post-view v-on-click-outside="close" v-if="post" :is-modal="true"></post-view>
        <comments-wrapper :post="post" v-if="post"></comments-wrapper>
      </div>
    </div>
  </div>
</template>

<script>
import PostView from './PostView.vue'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import CommentsWrapper from './../comment/CommentsWrapper.vue'
import PostShare from './PostShare.vue'
import EventBus from '../../../event-bus'

const KEY_CODE_ESC = 27
export default {
  name: 'PostModal',
  components: {
    PostView,
    CommentsWrapper,
    PostShare
  },
  mixins: [onClickOutside],
  mounted() {
    EventBus.$on('POST:MODAL:SHOW', this.showPost)
    EventBus.$on('POST:MODAL:FOCUS_COMMENT', this.focusComment)
  },
  destroyed() {
    EventBus.$off('POST:MODAL:SHOW', this.showPost)
    EventBus.$off('POST:MODAL:FOCUS_COMMENT', this.focusComment)
  },
  watch: {
    showPostModal(flag) {
      this.$helper.toggleBodyModalClass({ flag })
      if (flag) {
        window.addEventListener('keyup', this.keyUpHandler)
        window.addEventListener('popstate', this.popstateHandler)
      } else {
        window.removeEventListener('keyup', this.keyUpHandler)
        window.removeEventListener('popstate', this.popstateHandler)
      }
    }
  },
  methods: {
    showPost({ chain, post }) {
      if (!this.processing) {
        const target = {
          name: 'chain-post-view',
          params: {
            chain: chain,
            username: post.author,
            permlink: post.permlink
          }
        }
        return this.$store
          .dispatch('fetchPostByPermlink', {
            chain: chain,
            username: post.author,
            permlink: post.permlink
          })
          .then(() => {
            history.pushState(
              '',
              post.title,
              this.$helper.makePathForPost(post, chain)
            )
            this.$store.commit('core/setRouterFrom', { target })
          })
      }
    },
    focusComment({ chain, post }) {
      this.showPost({ chain, post }).then(() => {
        document.getElementById('comments-wrapper').scrollIntoView(true)
        const commentInputRoot = document.getElementById('comment-input-root')
        if (commentInputRoot) commentInputRoot.focus()
      })
    },
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
        const target = {
          name: 'chain-trend',
          params: {
            chain: this.$route.params.chain
          }
        }
        this.$store.commit('core/setRouterFrom', { target })
        this.$store.commit('setPostViewData', null)
      }
    }
  },
  computed: {
    showPostModal() {
      return (
        this.$route.name !== 'chain-post-view' &&
        (this.$store.state.postView.post ||
          this.$store.state.postView.processing)
      )
    },
    post() {
      return this.$store.state.postView.post
    },
    processing() {
      return this.$store.state.postView.processing
    }
  }
}
</script>
