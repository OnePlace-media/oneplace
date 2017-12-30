<template>
  <div>
    <tag-wrapper v-for="item in tags" :key="item.tag" :item="item"></tag-wrapper>
  </div>
</template>
<script>
import TagWrapper from './TagWrapper.vue'
export default {
  name: 'TagsList',
  props: ['tags'],
  components: {
    TagWrapper
  }
}
</script>

