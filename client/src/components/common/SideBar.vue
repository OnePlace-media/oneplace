<script>
const CONSTANTS = require('@oneplace/constants')
import Api from '../../plugins/api'
import { mixin as onClickOutside } from 'vue-on-click-outside'
export default {
  name: 'SideBar',
  data() {
    return {
      opened: false
    }
  },
  mixins: [onClickOutside],
  computed: {
    activeTag() {
      return this.$store.state.trends.activeTag
    },
    tags() {
      const _tags = (this.$auth.check() && this.$auth.user().tags
        ? this.$auth.user().tags
        : []
      ).filter(tag => tag.chain === this.$route.params.chain)
      return _tags.length
        ? _tags
        : CONSTANTS.DEFAULT.TAGS[this.$route.params.chain]
    }
  },
  methods: {
    swipe() {
      this.opened = false
    },
    toggle() {
      this.opened = !this.opened
    },
    close() {
      this.opened = false
      return true
    }
  }
}
</script>

<template>
  <div class="sidebar" :class="{'sidebar-opened': opened }" v-touch:swipe="swipe" v-if="$route.name === 'chain-trend'" v-on-click-outside="close">
      <nav class="sidebar__nav">
        <no-ssr v-if="$auth && $auth.ready()">
          <ul class="sidebar__nav-list">
            <li v-for="tag in tags" :key="tag.id">
              <a class="sidebar__nav-link link" 
                :class="{'sidebar__nav-link-active': activeTag === tag.text}"
                @click="close"
                :href="`#${tag.text}`" 
                v-scroll-to="`#tag-${tag.text}`">
                <span>{{tag.text | unGolosTag}}</span>
              </a>
            </li>
          </ul>
        </no-ssr>
      </nav>
      <div class="sidebar__nav-toggle" @click="toggle">
        <span class="sidebar__nav-toggle-btn"></span>
      </div>
  </div>
</template>
