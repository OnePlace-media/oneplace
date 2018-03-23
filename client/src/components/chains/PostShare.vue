<template>
  <div class="share-icons__wrapper" :class="{'share-icons__wrapper--visible': isVisible}">
    <social-sharing :url="url" inline-template>
      <div>
        <network network="facebook">
          <span data-link="#share-facebook">
            <i class="share-icon share-icon--facebook"></i>
          </span>
        </network>
        <network network="twitter">
          <span data-link="#share-twitter">
            <i class="share-icon share-icon--twitter"></i>
          </span>
        </network>
        <network network="googleplus">
          <span data-link="#share-googleplus">
            <i class="share-icon share-icon--google-plus"></i>
          </span>
        </network>
        <network network="vk">
          <span data-link="#share-vk">
            <i class="share-icon share-icon--vk"></i>
          </span>
        </network>
      </div>
    </social-sharing>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'PostShare',
  data() {
    return {
      isVisible: false,
      url: ''
    }
  },
  mounted() {
    this.scrollHandler()
    const target = document.getElementById('post-overlay') || window
    target.addEventListener('scroll', this.scrollHandler)
    Vue.nextTick(() => {
      this.url = window.location.href
    })
  },
  beforeDestroy() {
    const target = document.getElementById('post-overlay') || window
    target.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    scrollHandler() {
      const body = document.getElementById('post-body')

      if (body) {
        const rect = body.getBoundingClientRect()
        const pageHeight = document.body.getBoundingClientRect().height

        if (rect.height < pageHeight / 2) {
          this.isVisible = rect.bottom > pageHeight / 3
        } else {
          this.isVisible = rect.top < 0 && rect.bottom > pageHeight / 2
        }
      }
    }
  }
}
</script>

