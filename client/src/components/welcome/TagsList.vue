<template>
  <div>
    <tag-wrapper v-for="item in tags" :key="item.tag" :item="item" :chain="chain"></tag-wrapper>
  </div>
</template>
<script>
import TagWrapper from './TagWrapper.vue'
export default {
  name: 'TagsList',
  props: {
    tags: {
      type: Array,
      required: true
    },
    chain: {
      type: String,
      required: true
    }
  },
  components: {
    TagWrapper
  }
}
</script>

