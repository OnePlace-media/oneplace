<template>
  <section class="main-content">
    <div class="container">
      <no-ssr>
        <center><pulse-loader :loading="accountProcessing" :color="'#383838'" :size="'10px'"></pulse-loader></center>
      </no-ssr>
      <div class="blog__wrapper">
        <div class="profile__header" v-if="!accountProcessing" :style="cover ? `background-image:url('https://steemitimages.com/2048x512/${cover}')`: ''"></div>
        <div class="profile__wrapper" v-if="!accountProcessing">
          <div class="profile__avatar" :style="`background-image:url('${avatar}')`"></div>
          <div class="profile__top-block">
            <span class="profile__reputation">{{account.reputation}}</span>
            <h2 class="h2 profile__name">{{accountName}}</h2>
            <p class="profile__about">{{profile.about}}</p>

            <no-ssr>
              <div class="profile__btn-follow" :class="{'profile__btn-follow--active':isFollower || followProcessing}">
                <pulse-loader v-if="followProcessing" :color="'#383838'" :size="'10px'"></pulse-loader>

                <span @click="follow(false)" v-if="!isFollower && !followProcessing">{{$t('profile.follow')}}</span>
                <span v-if="isFollower && !followProcessing">{{$t('profile.isFollower')}}</span>

                <span class="profile__btn-more" @click="toggleFollowOptionsDropdown" v-if="isFollower && !followProcessing" v-on-click-outside="hideFollowOptionsDropdown">
                  <ul class="profile__follow-options" v-show="followOptionsDropdown">
                    <li class="profile__follow-options-item" @click="unfollow">{{$t('profile.unfollow')}}</li>
                    <!-- <li class="profile__follow-options-item" v-html="$t('profile.block_user')"></li> -->
                  </ul>
                </span>
              </div>
            </no-ssr>

            <div class="profile__info-block" v-if="profile.website || profile.location">
              <span class="profile__info-item profile__info-item--location" v-if="profile.location">{{profile.location}}</span>
              <span class="profile__info-item profile__info-item--website">
                <a class="link" :href="profile.website" target="_blank">{{profile.website}}</a>
              </span>
            </div>
          </div>
          
          <div class="profile__bottom-block">
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
        </div>
        <profile-blog :account="account" v-if="!accountProcessing"></profile-blog>
      </div>
    </div>
  </section>
</template>

<script>
import ProfileBlog from '../../components/chains/ProfileBlog'
import CONSTANTS from '@oneplace/constants'
import { mixin as onClickOutside } from 'vue-on-click-outside'

export default {
  name: 'Profile',
  components: {
    ProfileBlog
  },
  mixins: [onClickOutside],
  asyncData({ store, route, router }) {
    if (store.state.profile.account.data.name !== route.params.username) {
      store.commit('profile/CLEAR_ALL_DATA')
      return store
        .dispatch('profile/fetchState', {
          chain: route.params.chain,
          username: route.params.username
        })
        .catch(err => {
          if (err.response.status === 500) {
            store.commit('set404Page', true)
          }
        })
    } else return new Promise(resolve => resolve())
  },
  data() {
    return {
      followOptionsDropdown: false
    }
  },
  metaInfo() {
    return this.$helper.generateProfileMeta(this.account, this.$route)
  },
  methods: {
    follow(unfollow = false) {
      this.$store.dispatch('profile/follow', {
        chain: this.$route.params.chain,
        follower: this.accountCurrent.data.name,
        following: this.account.name,
        unfollow: unfollow
      })
    },
    unfollow() {
      this.follow(true)
    },
    hideFollowOptionsDropdown(){
      this.followOptionsDropdown = false
    },
    toggleFollowOptionsDropdown() {
        this.followOptionsDropdown = !this.followOptionsDropdown
    }
  },
  mounted() {
    const fetchFollowersByCurrentAccounts = () => {
      this.dataPromise.then(() => {
        if (this.accounts.length) {
          this.$store.dispatch('profile/fetchFollowersByCurrentAccounts', {
            chain: this.chain,
            accounts: this.accounts,
            following: this.account.name
          })
        }
      })
    }

    if (this.$auth.ready()) fetchFollowersByCurrentAccounts()
    else this.$auth.ready(fetchFollowersByCurrentAccounts)
  },
  computed: {
    followProcessing() {
      return (
        this.$store.state.profile.account.followProcessing ||
        !this.isFollowerReady
      )
    },
    isFollower() {
      return !!this.$store.state.profile.followers.byCurrentAccounts.collection.filter(
        item => item.follower === this.accountCurrent.data.name
      ).length
    },
    isFollowerReady() {
      return (
        this.$auth &&
        this.$auth.check() &&
        !this.$store.state.profile.followers.byCurrentAccounts.processing
      )
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
      return this.account.meta && this.account.meta.name
        ? this.account.meta.name
        : this.account.name
    },
    profile() {
      return this.account.meta && this.account.meta.profile
        ? this.account.meta.profile
        : {}
    },
    cover() {
      return this.profile.cover_image || ''
    },
    avatar() {
      return this.profile.profile_image || CONSTANTS.DEFAULT.AVATAR_IMAGE
    }
  }
}
</script>
