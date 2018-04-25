<template>
  <div class="btn-follow" :class="{'btn-follow--post': isPost, 'btn-follow--active':isFollower || followProcessing}">
    <pulse-loader v-if="followProcessing" :color="'#383838'" :size="'10px'"></pulse-loader>
    <span @click="follow(false)" v-if="!isFollower && !followProcessing">{{$t('profile.follow')}}</span>
    <span v-if="isFollower && !followProcessing">{{$t('profile.isFollower')}}</span>

    <span class="btn-follow__more" @click="toggleFollowOptionsDropdown" v-if="isFollower && !followProcessing" v-on-click-outside="hideFollowOptionsDropdown">
      <ul class="btn-follow__options" v-show="followOptionsDropdown">
        <li class="btn-follow__options-item" @click="unfollow">{{$t('profile.unfollow')}}</li>
        <!-- <li class="btn-follow__options-item" v-html="$t('profile.block_user')"></li> -->
      </ul>
    </span>
  </div>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import Api from '../../../plugins/api'

function checkFollower() {
  const startFollower = this.accountFollower.username
  this.checkFollowerProcessing = true
  Api.getFollowers(this.chain, {
    following: this.accountFollowing.name,
    startFollower,
    followType: 'blog',
    limit: 1
  }).then(response => {
    if (this.accountFollower.username === startFollower) {
      const followers = response.data
      this.isFollower = !!followers.filter(
        item => item.follower === this.accountFollower.username
      ).length
      this.checkFollowerProcessing = false
    }
  })
}
export default {
  name: 'ProfileFollowBtn',
  mixins: [onClickOutside],
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return !!~['blog', 'post'].indexOf(value)
      }
    },
    chain: {
      type: String,
      required: true,
      validator(value) {
        return !!~['s', 'g'].indexOf(value)
      }
    },
    accountFollowing: {
      type: Object,
      required: true
    },
    accountFollower: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      followOptionsDropdown: false,
      checkFollowerProcessing: true,
      isFollower: false
    }
  },
  watch: {
    accountFollower(oldValue, newValue) {
      checkFollower.call(this)
    }
  },
  mounted() {
    checkFollower.call(this)
  },
  methods: {
    follow(unfollow = false) {
      const follower = this.accountFollower.username
      this.checkFollowerProcessing = true
      return Api.follow(
        this.chain,
        this.accountFollower.username,
        this.accountFollowing.name,
        unfollow
      ).then(() => {
        if (this.accountFollower.username === follower) checkFollower.call(this)
      })
    },
    unfollow() {
      this.follow(true)
    },
    hideFollowOptionsDropdown() {
      this.followOptionsDropdown = false
    },
    toggleFollowOptionsDropdown() {
      this.followOptionsDropdown = !this.followOptionsDropdown
    }
  },
  computed: {
    isPost() {
      return this.type === 'post'
    },
    followProcessing() {
      return this.checkFollowerProcessing || !this.isFollowerReady
    },
    isFollowerReady() {
      return this.$auth && this.$auth.check() && !this.checkFollowerProcessing
    }
  }
}
</script>

