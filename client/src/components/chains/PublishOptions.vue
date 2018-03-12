<template>
  <span class="publish__btn publish__btn--publish" @click="setIsVisible(true)" v-on-click-outside="close" >{{$t('publish.publish')}}
    <span class="icon--arrow-down"></span>
    <div class="dropdown publish__setup" v-show="isVisible">
      <span class="publish__setup-header"><h2 class="h2">{{$t('publish.readyToPublish')}}</h2></span>
      <div class="publish__setup-tags">
        <h4 class="h4">{{$t('publish.addTags_upTo5')}}:</h4>
        <input 
          type="text" 
          class="publish__tags-input input" 
          :placeholder="$t('publish.typeTagsHere')" 
          v-validate="'firstIsLetter|lastIsLetterOrDigit|validTag|max:64'"
          name="tag" 
          :disabled="tags.length >= 5"
          @keydown.enter.prevent="addTag($event.target)"
        >
        <div class="publish__tags-wrapper">
          <span class="tags-list__item" v-for="tag in tags" :key="tag">{{tag | unGolosTag}} <span class="tags-list__remove-item" @click="removeTag(tag)"></span></span> 
        </div>
        <span class="tags-setup__input-alert" :class="{'tags-setup__input-alert--active': errors.any()}">
          <div v-if="errors.firstByRule('tag', 'firstIsLetter')">{{$t('common.validate.firstIsLetter')}}</div>
          <div v-if="errors.firstByRule('tag', 'lastIsLetterOrDigit')">{{$t('common.validate.lastIsLetterOrDigit')}}</div>
          <div v-if="errors.firstByRule('tag', 'validTag')">{{$t('common.validate.tagFormat')}}</div>
          <div v-if="errors.firstByRule('tag', 'max')">{{$t('common.validate.tagMax')}}</div>
        </span>
      </div>
      <div class="publish__setup-payout">
        <h4 class="h4 publish__setup-payout-title">{{$t('publish.payoutSettings')}}:</h4>
        <input class="publish__radio" id="option-1" type="radio" name="chain" value="50" v-model="rewardsOpts">
        <label class="publish__radio-label" for="option-1">{{$t('publish.50')}}</label>
        <input class="publish__radio" id="option-2" type="radio" name="chain" value="100" v-model="rewardsOpts">
        <label class="publish__radio-label" for="option-2">{{$t('publish.100')}}</label>
        <input class="publish__radio" id="option-3" type="radio" name="chain" value="0" v-model="rewardsOpts">
        <label class="publish__radio-label" for="option-3">{{$t('publish.0')}}</label>
      </div>
      <div class="publish__final">
          <input type="checkbox" value="1" id="checkbox-1" class="publish__checkbox" v-model="upVotePost">
          <label for="checkbox-1" class="publish__checkbox-label">{{$t('publish.upVotePost')}}</label>
          <div class="publish__post-btn-group">
            <button 
              class="btn btn--large publish__btn-post" 
              :class="{'publish__btn-post--active': isValid}"
              @click="onPublish"
            >
              {{$t('publish.publish')}}
            </button>
            <a href="#" class="post-view__post-btn-link">Cancel</a>
          </div>
      </div>
    </div>
  </span>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import EventBus from '../../event-bus'
import { golosTag } from '../../filters/golos.tag'

const CONSTANTS = require('@oneplace/constants')

const PUBLISH_HEADER_VISIBLE = 'PUBLISH_HEADER_VISIBLE'
const COMPONENT_NAME = 'PublishOptions'

const stateModel = name => {
  return {
    get() {
      return this.$store.state.publish.form[name]
    },
    set(value) {
      this.$store.commit('publish/SET_FORM_OBJECT', { [name]: value })
    }
  }
}
export default {
  $_veeValidate: {
    validator: 'new'
  },
  name: COMPONENT_NAME,
  mixins: [onClickOutside],
  props: {
    chain: {
      type: String,
      required: true
    },
    account: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  computed: {
    isValid() {
      const title = this.$store.state.publish.form.title
      const body = this.$store.state.publish.form.body

      return title && body && this.tags.length
    },
    rewardsOpts: stateModel('rewardsOpts'),
    upVotePost: stateModel('upVotePost'),
    tags: stateModel('tags')
  },
  mounted() {
    EventBus.$on(PUBLISH_HEADER_VISIBLE, ({ name, flag }) => {
      if (name !== COMPONENT_NAME && flag) this.isVisible = false
    })
  },
  methods: {
    setIsVisible(flag) {
      this.isVisible = flag
      EventBus.$emit(PUBLISH_HEADER_VISIBLE, { name: COMPONENT_NAME, flag })
    },
    close() {
      this.setIsVisible(false)
    },
    removeTag(tag) {
      this.tags = this.tags.filter(_tag => _tag !== tag)
    },
    addTag(input) {
      let tag = input.value.toLowerCase()
      this.$validator
        .validateAll()
        .then(() => {
          if (this.errors.any()) throw new Error('INVALID_FORM')
          if (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS)
            tag = golosTag(tag)

          if (!~this.tags.indexOf(tag)) this.tags = this.tags.concat([tag])

          input.value = ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    onPublish() {
      this.$store.dispatch('publish/submitForm', { account })
    }
  }
}
</script>
