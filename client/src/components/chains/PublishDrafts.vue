<template>
  <span class="publish__btn publish__btn--drafts" @click="setIsVisible(true)" v-on-click-outside="close">{{$t('publish.drafts')}}
    <span class="icon--arrow-down"></span>
    <div class="dropdown publish__drafts" v-show="isVisible">
      <center v-if="processing">
        <pulse-loader :color="'#383838'" :size="'10px'"></pulse-loader>
      </center>

      <div class="publish__drafts-new" v-if="!processing" @click.stop="createDraft">{{$t('publish.createNewDraft')}}</div>
      <div class="publish__no-drafts" v-if="!processing && drafts && !drafts.length">{{$t('publish.youHaveNoDrafts')}}</div>
      <div class="publish__drafts-list">
        <div class="publish__drafts-item" v-for="draft in drafts" :key="draft.id" @click.stop="selectDraft(draft)">
          <div class="column-wrapper">
            <span class="publish__drafts-name">{{draft.title}}</span>
            <span class="publish__drafts-time">
              <time-ago :time="draft.time.toString()"></time-ago>
            </span>
          </div>
          <a href="#" title="Delete draft" @click.stop="deleteDraft(draft)">
            <svg class="publish__icon">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#delete"></use>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import EventBus from '../../event-bus'
const PUBLISH_HEADER_VISIBLE = 'PUBLISH_HEADER_VISIBLE'
const COMPONENT_NAME = 'PublishDrafts'

const INTERVAL_BETWEEN_SAVE_DRAFT = 5 * 1000
export default {
  name: COMPONENT_NAME,
  mixins: [onClickOutside],
  data() {
    return {
      isVisible: false,
      interval: null
    }
  },
  mounted() {
    EventBus.$on(PUBLISH_HEADER_VISIBLE, ({ name, flag }) => {
      if (name !== COMPONENT_NAME && flag) this.isVisible = false
    })

    const initDrafts = () => {
      const opts = { userId: this.$auth.user().id }

      this.$store.dispatch('publish/initDrafts', opts)

      this.interval = setInterval(() => {
        this.$store.dispatch('publish/saveDraft', opts)
      }, INTERVAL_BETWEEN_SAVE_DRAFT)
    }
    
    this.$auth.ready() ? initDrafts() : this.$auth.ready(initDrafts)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  computed: {
    drafts() {
      return this.$store.state.publish.drafts.collection
    },
    processing() {
      return this.$store.state.publish.drafts.processing
    }
  },
  methods: {
    setIsVisible(flag) {
      this.isVisible = flag
      EventBus.$emit(PUBLISH_HEADER_VISIBLE, { name: COMPONENT_NAME, flag })
    },
    close() {
      this.setIsVisible(false)
    },
    createDraft() {
      this.$store.dispatch('publish/createDraft').then(() => {
        this.$emit('update')
      })
    },
    deleteDraft(draft) {
      this.$store.dispatch('publish/deleteDraft', { draft }).then(() => {
        this.$emit('update')
      })
    },
    selectDraft(draft) {
      this.$store.dispatch('publish/selectDraft', { draft })
      this.isVisible = false
      this.$emit('update')
    }
  }
}
</script>
