<template>
  <form class="tags-setup__form" @submit.prevent="onSubmit" v-if="view === 'welcome'" autocomplete="off">
    <h2 class="h2 tags-setup__title">{{$t('welcome.tagsStep.header')}}</h2>
    <div class="tags-setup__input-wrapper">
      <div class="tags-setup__input-text">
        <span class="tags-setup__input-name">{{$t('tagsForm.addTagsWithChain', {blockchain: chainName})}}:</span>
        <span class="tags-setup__input-alert" :class="{'tags-setup__input-alert--active': errors.any()}">
          <div v-if="!errors.any() || errors.firstByRule('tag', 'maxCount')">{{$t('tagsForm.upTo20')}}</div>
          <div v-if="errors.firstByRule('tag', 'firstIsLetter')">{{$t('common.validate.firstIsLetter')}}</div>
          <div v-if="errors.firstByRule('tag', 'lastIsLetterOrDigit')">{{$t('common.validate.lastIsLetterOrDigit')}}</div>
          <div v-if="errors.firstByRule('tag', 'validTag')">{{$t('common.validate.tagFormat')}}</div>
          <div v-if="errors.firstByRule('tag', 'max')">{{$t('common.validate.tagMax')}}</div>
        </span>
      </div>
      <input 
        v-validate="'firstIsLetter|lastIsLetterOrDigit|validTag|max:64'"
        type="text" 
        class="login-form__input" 
        :placeholder="$t('tagsForm.typeTagsHere')"
        name="tag" 
        @keydown.enter.prevent="addTag($event.target)"
      >
    </div>
    <div class="tags-setup__info">
      <div>{{$t('tagsForm.help')}}</div>
    </div>
    <div class="tags-list__wrapper">
      <draggable v-model="steemTags" v-if="chain === CHAINS.STEEM">
        <span class="tags-list__item" v-for="tag in steemTags" :key="tag.text">{{tag.text | unGolosTag | toLowerCase}}
          <span class="tags-list__remove-item" @click="removeTag(tag)"></span>
        </span>
      </draggable>
      <draggable v-model="golosTags" v-if="chain === CHAINS.GOLOS">
        <span class="tags-list__item" v-for="tag in golosTags" :key="tag.text">{{tag.text | unGolosTag | toLowerCase}}
          <span class="tags-list__remove-item" @click="removeTag(tag)"></span>
        </span>
      </draggable>
    </div>
    <button type="submit" class="btn tags-setup__btn">{{$t('welcome.tagsStep.startYourJourney')}}</button>
  </form>

  <div class="settings__tags-panel-wrapper" v-else>
    <div class="settings__tags-panel" :class="{'settings__tags-panel--active': chain === CHAINS.STEEM}">
      <h3 class="settings__tags-chain settings__tags-chain--steem">Steem</h3>
      <div class="tags-list__wrapper">
        <draggable v-model="steemTags">
          <span class="tags-list__item" v-for="tag in steemTags" :key="tag.text">{{tag.text}}
            <span class="tags-list__remove-item" @click="removeTag(tag)"></span>
          </span>
        </draggable>
      </div>
      <a href="#" class="btn-expand" @click.prevent="setChain(CHAINS.STEEM)" :title="$t('tagsForm.addTagsWithChain',{blockchain: 'Steem'})"></a>
    </div>
    <div class="settings__tags-panel" :class="{'settings__tags-panel--active': chain === CHAINS.GOLOS}">
      <h3 class="settings__tags-chain settings__tags-chain--golos">Golos</h3>
      <div class="tags-list__wrapper">
        <draggable v-model="golosTags">
          <span class="tags-list__item" v-for="tag in golosTags" :key="tag.text">{{tag.text | unGolosTag | toLowerCase}}
            <span class="tags-list__remove-item" @click="removeTag(tag)"></span>
          </span>
        </draggable>
      </div>
      <a href="#" class="btn-expand" @click.prevent="setChain(CHAINS.GOLOS)" :title="$t('tagsForm.addTagsWithChain',{blockchain: 'Golos'})"></a>
    </div>
    <div class="settings__tags-setup" v-if="chain">
      <div class="tags-setup__input-wrapper">
        <div class="tags-setup__input-text">
          <span class="tags-setup__input-name">{{$t('tagsForm.addTagsWithChain',{blockchain: chainName})}}:</span>
          <span class="tags-setup__input-alert" :class="{'tags-setup__input-alert--active': errors.any()}">
            <div v-if="!errors.any() || errors.firstByRule('tag', 'maxCount')">{{$t('tagsForm.upTo20')}}</div>
            <div v-if="errors.firstByRule('tag', 'firstIsLetter')">{{$t('common.validate.firstIsLetter')}}</div>
            <div v-if="errors.firstByRule('tag', 'lastIsLetterOrDigit')">{{$t('common.validate.lastIsLetterOrDigit')}}</div>
            <div v-if="errors.firstByRule('tag', 'validTag')">{{$t('common.validate.tagFormat')}}</div>
            <div v-if="errors.firstByRule('tag', 'max')">{{$t('common.validate.tagMax')}}</div>
          </span>
        </div>
        <input v-validate="'firstIsLetter|lastIsLetterOrDigit|validTag|max:64'"
          type="text" 
          class="login-form__input" 
          :placeholder="$t('tagsForm.typeTagsHere')"
          name="tag" 
          @keydown.enter.prevent="addTag($event.target)">
      </div>
      <div class="tags-setup__info">{{$t('tagsForm.helpSettings')}}</div>
      <a href="#" class="settings__clear-tags-btn" @click.prevent="clearApproveShow = !clearApproveShow">{{$t('tagsForm.clearAllChainTags',{blockchain:chainName})}}
        <span class="settings__approve-btn" v-show="clearApproveShow" @click.prevent="clearTags">{{$t('tagsForm.approve')}}</span>
      </a>
    </div>
  </div>
</template>

<script>
const CONSTANTS = require('@oneplace/constants')
import draggable from 'vuedraggable'
import { golosTag } from '../../filters/golos.tag'

import { Validator } from 'vee-validate'
Validator.extend('firstIsLetter', {
  getMessage: field => 'Must begin with a letter',
  validate: value => /^[a-zA-Zа-яА-ЯЁё](.*)+?$/.test(value)
})

Validator.extend('lastIsLetterOrDigit', {
  getMessage: field => 'Must end with a letter or a digit',
  validate: value => /^(.*)+[a-zA-Zа-яА-ЯЁё0-9]$/.test(value)
})

Validator.extend('validTag', {
  getMessage: field => 'Use only letters, digits and one dash',
  validate: value =>
    /^[a-zA-Zа-яА-ЯЁё][a-zA-Zа-яА-ЯЁё0-9]+(\-)?[a-zA-Zа-яА-ЯЁё0-9]+$/.test(
      value
    )
})

export default {
  $_veeValidate: {
    validator: 'new'
  },
  name: 'TagsForm',
  props: {
    view: {
      type: String, // welcome, settings
      required: true
    },
    chainExt: {
      type: String // s, g
    }
  },
  components: {
    draggable
  },
  created() {
    if (this.chainExt) this.chain = this.chainExt
  },
  data() {
    return {
      clearApproveShow: false,
      chain: CONSTANTS.BLOCKCHAIN.SOURCE.STEEM
    }
  },
  computed: {
    VIEWS() {
      return {
        WELCOME: 'welcome',
        SETTINGS: 'settings'
      }
    },
    CHAINS() {
      return CONSTANTS.BLOCKCHAIN.SOURCE
    },
    chainName() {
      return {
        s: 'Steem',
        g: 'Golos'
      }[this.chain]
    },
    storages: {
      get(chain) {
        return chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM
          ? this.steemTags
          : this.golosTags
      }
    },
    steemTags: {
      set(value) {
        this.$store.dispatch('saveUserTags', {
          id: this.$auth.user().id,
          chain: CONSTANTS.BLOCKCHAIN.SOURCE.STEEM,
          tags: value
        })
      },
      get() {
        return this.$store.state.tagsForm.storages[
          CONSTANTS.BLOCKCHAIN.SOURCE.STEEM
        ]
      }
    },
    golosTags: {
      set(value) {
        this.$store.dispatch('saveUserTags', {
          id: this.$auth.user().id,
          chain: CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS,
          tags: value
        })
      },
      get() {
        return this.$store.state.tagsForm.storages[
          CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
        ]
      }
    }
  },
  methods: {
    setChain(chain) {
      this.errors.remove('tag', 'maxCount')
      this.chain = chain
    },
    clearTags() {
      this.$store.dispatch('clearUserTags', {
        chain: this.chain,
        userId: this.$auth.user().id
      })
    },
    onSubmit() {
      this.$store
        .dispatch('saveUserTags', {
          id: this.$auth.user().id,
          chain: this.chain,
          tags: this.$store.state.tagsForm.storages[this.chain]
        })
        .then(() => {
          if (this.view === this.VIEWS.WELCOME) {
            this.$router.push({
              name: 'chain-trend',
              params: { chain: this.chain }
            })
          }
        })
    },
    addTag(input) {
      if (this.$store.state.tagsForm.storages[this.chain].length >= 20) {
        this.errors.add({
          field: 'tag',
          rule: 'maxCount',
          scope: 'maxCount',
          id: ['tag', 'maxCount'].join(),
          msg: 'Up to 20'
        })
      }

      let tag = input.value.toLowerCase()
      if (tag) {
        this.$validator.validateAll().then(() => {
          if (this.errors.any()) throw new Error('INVALID_FORM')
          if (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS) {
            tag = golosTag(tag)
          }

          this.$store.commit('addUserTag', {
            tag: { text: tag, chain: this.chain },
            chain: this.chain
          })

          if (this.view === this.VIEWS.SETTINGS) {
            this.$store.dispatch('saveUserTags', {
              id: this.$auth.user().id,
              chain: this.chain,
              tags: this.$store.state.tagsForm.storages[this.chain]
            })
          }
          input.value = ''
        })
      }
    },
    removeTag(tag) {
      this.errors.remove('tag', 'maxCount')
      if (this.view === this.VIEWS.WELCOME) {
        this.$store.commit('toggleUserTag', { tag, chain: tag.chain })
      } else {
        this.$store.dispatch('removeUserTag', {
          tag,
          userId: this.$auth.user().id
        })
      }
    }
  }
}
</script>
