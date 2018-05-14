<template>
  <section class="main-content">
    <div class="container">
      <no-ssr>
        <center><pulse-loader :loading="accountProcessing" :color="'#383838'" :size="'10px'"></pulse-loader></center>
      </no-ssr>
      <div class="blog__wrapper">
        <div class="profile__header" v-if="!accountProcessing" 
          :style="`background-image:url('${cover}')`">
        </div>
        <div class="profile__wrapper" v-if="!accountProcessing">
          <div class="profile__avatar" :style="`background-image:url('${avatar}')`"></div>
          <div class="profile__top-block">
            <h2 class="h2 profile__name">{{accountName}}</h2>
            <p class="profile__about" v-if="profile.about">{{profile.about}}</p>

            <no-ssr v-if="$auth && $auth.check() && accountCurrent.username">
              <profile-follow-btn
                :chain="chain"
                :account-follower="accountCurrent"
                :account-following="account"
                type="blog"
              ></profile-follow-btn>
            </no-ssr>

            <div class="profile__info-block" v-if="profile.website || profile.location">
              <span class="profile__info-item profile__info-item--location" v-if="profile.location">{{profile.location}}</span>
              <span class="profile__info-item profile__info-item--website" v-if="profile.website">
                <a class="link" :href="profile.website" target="_blank">{{website}}</a>
              </span>
            </div>
          </div>
          
          <div class="profile__bottom-block" id="profile__bottom-block">
            <div class="profile__user-data">
              <span class="profile__data-value">{{account.post_count}}</span>
              {{$tc('profile.posts', account.post_count)}}
            </div>
            <div class="profile__user-data">
              <span class="profile__data-value">{{followCount.follower_count}}</span>
              {{$tc('profile.followers', followCount.follower_count)}}
            </div>
            <div class="profile__user-data">
              <span class="profile__data-value">{{followCount.following_count}}</span>
              {{$tc('profile.following', followCount.following_count)}}
            </div>
          </div>
          <profile-filter-by-tags :tags="tags"></profile-filter-by-tags>
          <filter-by-tags-modal v-if="filterByTagsShow" :tags="tags" @change="change"></filter-by-tags-modal>
        </div>
        <profile-blog :account="account" v-if="!accountProcessing"></profile-blog>
      </div>
    </div>
  </section>
</template>

<script>
import ProfileBlog from '../../components/chains/profile/ProfileBlog.vue'
import ProfileFollowBtn from '../../components/chains/profile/ProfileFollowBtn.vue'
import ProfileFilterByTags from '../../components/chains/profile/ProfileFilterByTags.vue'
const parser = require('@oneplace/blockchains-api/parser')
import FilterByTagsModal from '../../components/chains/common/FilterByTagsModal.vue'
import EventBus from '../../event-bus'

import CONSTANTS from '@oneplace/constants'
import { mixin as onClickOutside } from 'vue-on-click-outside'

export default {
  name: 'Profile',
  components: {
    ProfileBlog,
    ProfileFollowBtn,
    ProfileFilterByTags,
    FilterByTagsModal
  },
  mixins: [onClickOutside],
  asyncData({ store, route, router }) {
    const username = store.state.profile.account.data.name
    const chain = store.state.profile.chain
    if (username !== route.params.username || chain !== route.params.chain) {
      store.commit('profile/CLEAR_ALL_DATA')
      store.commit('filterByTags/CLEAR_ALL_DATA')
      return store
        .dispatch('profile/fetchState', {
          chain: route.params.chain,
          username: route.params.username
        })
        .catch(err => {
          console.log(err)
          if (
            (err && ~[500, 404].indexOf(err.status)) ||
            (err.response && ~[500, 404].indexOf(err.response.status))
          ) {
            store.commit('set404Page', true)
          }
        })
    } else return Promise.resolve()
  },
  metaInfo() {
    return this.$metaGenerator.profile(this.account, this.$route)
  },
  methods: {
    change({ include, exclude }) {
      EventBus.$emit('PROFILE:FILTER:CHANGE', { include, exclude })
    }
  },
  computed: {
    filterByTagsShow() {
      return this.$store.state.filterByTags.modalShow
    },
    tags() {
      const posts = this.$store.state.profile.posts.collection
      const tags = parser.getTagsFromPosts(posts)
      tags.sort((a, b) => b.count - a.count)
      return tags
    },
    showAllTagsModal() {
      return this.$store.state.profile.tags.showAllTags
    },
    accountsByChain() {
      return this.accounts.filter(acc => acc.chain === this.chain)
    },
    accounts() {
      return this.$auth && this.$auth.check() ? this.$auth.user().accounts : []
    },
    accountCurrent() {
      let result = { avatar: CONSTANTS.DEFAULT.AVATAR_IMAGE, username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain
    },
    accountProcessing() {
      return this.$store.state.profile.account.processing
    },
    followCount() {
      return this.account.followCount || {}
    },
    account() {
      return this.$store.state.profile.account.data
    },
    accountName() {
      return this.profile.name || this.account.name
    },
    profile() {
      return this.account.meta && this.account.meta.profile
        ? this.account.meta.profile
        : {}
    },
    cover() {
      const cover = this.profile.cover_image
      return cover
        ? `https://steemitimages.com/2048x512/${cover}`
        : '/static/img/header.jpg'
    },
    avatar() {
      return `https://steemitimages.com/0x0/` + this.profile.profile_image || CONSTANTS.DEFAULT.AVATAR_IMAGE
    },
    website() {
      return this.profile.website
        ? this.profile.website.replace(/http(s)?:\/\//, '')
        : ''
    }
  }
}
</script>
