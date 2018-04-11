<template>
  <div class="container tags-setup tags-setup__row" v-if="chain === CHAINS.STEEM">
    <div class="tags-setup__column tags-setup__w5">
    <div class="tags-setup__form-wrapper">
      <tags-form view="welcome" :chain-ext="chain"></tags-form>
      </div>
      <tags-list :chain="chain" :tags="tags.bottom" class="tags-setup__row tags-setup__w2"></tags-list>
    </div>
    <tags-list :chain="chain" :tags="tags.verticalFirst" class="tags-setup__column tags-setup__w1"></tags-list>
    <div class="tags-setup__column tags-setup__w2">
      <tag-wrapper :item="tags.single" :chain="chain"></tag-wrapper>
      <div class="tags-setup__row tags-setup__w4">
        <tags-list :chain="chain" :tags="tags.verticalSecond" class="tags-setup__column tags-setup__w1"></tags-list>
        <tags-list :chain="chain" :tags="tags.verticalThird" class="tags-setup__column tags-setup__w1"></tags-list>
      </div>
    </div>
  </div>

  <div class="container tags-setup tags-setup__column" v-else-if="chain === CHAINS.GOLOS">
    <div class="tags-setup__row tags-setup__w3">
      <div class="tags-setup__form-wrapper tags-setup__w5">
        <tags-form view="welcome" :chain-ext="chain"></tags-form>
      </div>
      <div class="tags-setup__row tags-setup__w3">
        <tags-list :chain="chain" :tags="tags.topFirst" class="tags-setup__column tags-setup__w2"></tags-list>
        <tags-list :chain="chain" :tags="tags.topSecond" class="tags-setup__column tags-setup__w1"></tags-list>
      </div>
    </div>
    <tags-list :chain="chain" :tags="tags.bottom" class="tags-setup__row tags-setup__w2"></tags-list>
  </div>
</template>

<script>
import CONSTANTS from '@oneplace/constants'
import TagsForm from '../settings/TagsForm.vue'
import TagsList from './TagsList.vue'
import TagWrapper from './TagWrapper.vue'

const TAGS = {
  [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: {
    bottom: [
      { tag: 'health' },
      { tag: 'introduceyourself', w2: true },
      { tag: 'life' },
      { tag: 'money' },
      { tag: 'philosophy', w2: true },
      { tag: 'photography', w2: true },
      { tag: 'story' }
    ],
    verticalFirst: [
      { tag: 'art' },
      { tag: 'bitcoin', h2: true },
      { tag: 'music' },
      { tag: 'science' }
    ],
    single: { tag: 'blockchain', w2: true },
    verticalSecond: [
      { tag: 'food' },
      { tag: 'nature', h2: true },
      { tag: 'travel' }
    ],
    verticalThird: [
      { tag: 'funny' },
      { tag: 'news' },
      { tag: 'politics' },
      { tag: 'video' }
    ]
  },
  [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: {
    topFirst: [
      { tag: 'ru--bitkoin', w2: true },
      { tag: 'ru--blokcheijn', w2: true },
      { tag: 'ru--znakomstvo', w2: true }
    ],
    topSecond: [{ tag: 'ru--biznes' }, { tag: 'ru--zhiznx', h2: true }],
    bottom: [
      { tag: 'ru--iskusstvo', w2: true },
      { tag: 'ru--istoriya' },
      { tag: 'ru--konkurs' },
      { tag: 'ru--mysli' },
      { tag: 'ru--nauka' },
      { tag: 'ru--obrazovanie', w2: true },
      { tag: 'ru--priroda', w2: true },
      { tag: 'ru--puteshestviya', w2: true },
      { tag: 'ru--tvorchestvo', w2: true },
      { tag: 'ru--fotografiya', w2: true }
    ]
  }
}
export default {
  name: 'SetupTagsStep',
  components: {
    TagsForm,
    TagsList,
    TagWrapper
  },
  computed: {
    chain() {
      return this.$route.params.chain
    },
    CHAINS() {
      return CONSTANTS.BLOCKCHAIN.SOURCE
    },
    tags() {
      return TAGS[this.chain]
    },
    selected() {
      return this.$store.state.user.tags
    }
  }
}
</script>
