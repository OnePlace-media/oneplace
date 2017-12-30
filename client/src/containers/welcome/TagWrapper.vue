<template>
<div 
  @click="addTag({target:{value:item.tag}})"
  class="tags-setup__item-wrapper" 
  :class="{'tags-setup__item-wrapper--w2x': item.w2, 'tags-setup__item-wrapper--h2x': item.h2}">
  <div 
    class="tags-setup__item" 
    :class="{[`tags-setup__${item.tag}`]: 1, 'tags-setup__item--selected': selected}">
    <h2 class="h2 tags-setup__tag">
      {{item.tag | unGolosTag}}
    </h2>
  </div>
</div>
</template>
<script>
export default {
  name: 'TagWrapper',
  props: ['item'],
  computed: {
    chain() {
      return this.$store.state.welcome.chain
    },
    selected() {
      return ~this.$store.state.tagsForm.storages[this.chain].findIndex(
        tag => tag.text === this.item.tag
      )
    }
  },
  methods: {
    addTag(e) {
      if (this.$store.state.tagsForm.storages[this.chain].length < 20) {
        this.$store.commit('toggleUserTag', {
          chain: this.chain,
          tag: { text: e.target.value, chain: this.chain }
        })
      }
    }
  }
}
</script>

