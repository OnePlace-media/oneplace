<template>
  <span 
      @click.stop="add(tag)"
      class="tags-list__item tags-list__item--filter" 
      :class="{'tags-list__item--selected': isInclude, 'tags-list__item--removed': isExclude}">
      {{tag.text | unGolosTag | toLowerCase}}
      <span class="tags-list__remove-item" @click.stop="remove(tag)" :alt="$t('profile.removeTag')"></span>
    </span>
</template>

<script>
export default {
  name: 'TagLabel',
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  methods: {
    add(tag) {
      this.$emit('add', tag)
    },
    remove(tag) {
      this.$emit('remove', tag)
    }
  },
  computed: {
    isInclude() {
      return this.$store.state.filterByTags.include[this.tag.text]
    },
    isExclude() {
      return this.$store.state.filterByTags.exclude[this.tag.text]
    }
  }
}
</script>
