<template>
  <section class="main-content">
    <div class="container">
      <no-ssr>
        <center><pulse-loader :loading="accountProcessing" :color="'#383838'" :size="'10px'"></pulse-loader></center>
      </no-ssr>
      
      <div class="profile__header" v-if="!accountProcessing" :style="cover ? `background-image:url('https://steemitimages.com/2048x512/${cover}')`: ''"></div>
      <div class="profile__wrapper" v-if="!accountProcessing">
        <div class="profile__avatar" :style="`background-image:url('${avatar}')`"></div>
        <div class="profile__user">
          <div class="profile__top-wrapper">
            <h2 class="h2 profile__name">
              {{accountName}}
              <span class="profile__reputation">{{account.reputation}}</span>
            </h2>
            <div class="profile__btn-group">
              <span class="profile__btn-follow">{{$t('profile.follow')}}</span>
              <span class="profile__btn-following" style="display:none;">{{$t('profile.following')}}</span>
              
              <span class="profile__btn-more" @click="toggleFollowOptionsDropdown">
                <ul class="profile__follow-options" v-show="followOptionsDropdown">
                  <li class="profile__follow-options-item">{{$t('profile.unfollow')}}</li>
                  <!-- <li class="profile__follow-options-item" v-html="$t('profile.block_user')"></li> -->
                </ul>
              </span>
            </div>
          </div>
          <p class="profile__about">{{profile.about}}</p>
          <div class="profile__info-wrapper">
            <div class="profile__info-tab" v-if="profile.location">
              <span class="profile__info-item">{{$t('profile.location')}}:</span>
              {{profile.location}}
            </div>

            <div class="profile__info-tab" v-if="profile.website">
              <span class="profile__info-item">{{$t('profile.website')}}:</span>
              <a class="link" :href="profile.website" target="_blank">{{profile.website}}</a>
            </div>
          </div>
          <div class="profile__bottom-wrapper">
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
      </div>
      <profile-blog :account="account" v-if="!accountProcessing"></profile-blog>
    </div>
  </section>
</template>

<script>
import ProfileBlog from '../../components/chains/ProfileBlog'
import CONSTANTS from '@oneplace/constants'
export default {
  name: 'Profile',
  components: {
    ProfileBlog
  },
  asyncData({ store, route, router }) {
    if (store.state.profile.account.data.name !== route.params.username) {
      store.commit('profile/CLEAR_ALL_DATA')
      return store
        .dispatch('profile/fetchAccount', {
          chain: route.params.chain,
          username: route.params.username
        })
        .then(() => {
          return store.dispatch('profile/fetchPostByAuthor', {
            chain: route.params.chain,
            author: route.params.username,
            before_date: new Date().toISOString().split('.')[0],
            limit: 5
          })
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
  methods: {
    toggleFollowOptionsDropdown() {
      this.followOptionsDropdown = !this.followOptionsDropdown
    }
  },
  computed: {
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
