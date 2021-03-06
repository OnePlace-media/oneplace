<script>
import Vue from 'vue'
import { mixin as onClickOutside } from 'vue-on-click-outside'

const CONSTANTS = require('@oneplace/constants')

export default {
  name: 'TopBar',
  mixins: [onClickOutside],
  computed: {
    DEFAULT_AVATAR() {
      return CONSTANTS.DEFAULT.AVATAR_IMAGE
    },
    userDropDownToggle() {
      return this.$store.state.user.dropDownOpen
    },
    isAuth() {
      return this.$auth && this.$auth.check()
    },
    chain() {
      return this.$route.params.chain || this.$store.state.chain || 's'
    },
    account() {
      let result = { avatar: CONSTANTS.DEFAULT.AVATAR_IMAGE, username: null }
      if (this.$auth && this.$auth.check() && this.accountsByChain.length) {
        result =
          this.accountsByChain.find(
            acc => acc.id === this.$store.state.user.accounts[this.chain].active
          ) || this.accountsByChain[0]
      }
      return result
    },
    accountsByChain() {
      return this.accounts.filter(acc => acc.chain === this.chain)
    },
    accounts() {
      return this.$auth && this.$auth.check() ? this.$auth.user().accounts : []
    },
    CHAINS() {
      return CONSTANTS.BLOCKCHAIN.SOURCE
    },
    isPopular() {
      return this.$route.name === 'chain-trend'
    },
    isFeed() {
      return this.$route.name === 'chain-account-feed' && this.$route.params.username === this.account.username
    },
    isBlog() {
      return this.$route.name === 'chain-account-view' && this.$route.params.username === this.account.username
    }
  },
  methods: {
    switchAccount($event, targetAccId) {
      this.$store.dispatch('switchAccount', {
        accounts: this.accounts,
        targetAccId
      })
      this.$store.commit('setDropDown', false)
    },
    closeDropDown(event) {
      if (this.userDropDownToggle) this.$store.dispatch('toggleDropDown')
    }
  }
}
</script>

<style>
.header__profile-btn,
.header__logo {
  cursor: pointer;
}
</style>

<template>
  <header class="header">
    <div class="header__wrapper container">
      
      <div class="row-wrapper">
        <router-link :to="{name:'chain-trend', params:{chain}}" class="header__logo" tag="div">
          <img src="/static/img/logo.svg" alt="OnePlace" class="img-responsive">
        </router-link>
        
        <div class="header__menu" v-if="$auth && $auth.ready() && account.username">
          <router-link 
            :to="{name:'chain-trend', params:{chain}}" 
            :class="{'header__menu-item--active': isPopular}"
            class="header__menu-item link" tag="a">{{$t('topBar.popular')}}
          </router-link>
          <router-link
            :to="{name:'chain-account-feed', params:{chain, username: account.username}}" 
            :class="{'header__menu-item--active': isFeed}"
            class="header__menu-item link" tag="a">{{$t('topBar.feed')}}
          </router-link>
          <router-link 
            :to="{name:'chain-account-view', params:{chain, username: account.username}}" 
            :class="{'header__menu-item--active': isBlog}"
            class="header__menu-item link" tag="a">{{$t('topBar.blog')}}
          </router-link>
        </div>
      </div>

      <div class="header__right-panel">
        <router-link :to="{name:'publish', params:{chain}}" class="header__publish" :title="$t('topBar.createNewPost')" v-if="accountsByChain.length">
          <svg class="icon--header">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/pencil.svg#icon"></use>
          </svg>
        </router-link>
        <div class="header__chain-wrapper">
          <router-link 
            :to="{name:'chain-trend', params:{chain: CHAINS.STEEM}}" 
            class="header__chain header__chain--steem" 
            :class="{' header__chain--active': chain === CHAINS.STEEM}"
            title="Steem">
          </router-link>
           <router-link 
            :to="{name:'chain-trend', params:{chain: CHAINS.GOLOS}}" 
            class="header__chain header__chain--golos" 
            :class="{' header__chain--active': chain === CHAINS.GOLOS}"
            title="Golos">
          </router-link>
        </div>
        <no-ssr v-if="$auth && $auth.ready()">
          <router-link :to="{name:'auth-login', params:{lang:'ru'}}" class="header__auth link" v-if="!isAuth">{{$t('topBar.getStarted')}}</router-link>
          <div class="header__user-wrapper" v-else v-on-click-outside="closeDropDown">
            <router-link 
              tag="a" 
              :to="account.username ? {name:'chain-account-view', params:{chain, username: account.username}} : {name:'add-account', params:{chain}}" 
              class="header__user-avatar avatar"
              :style="`background-image: url('${account.avatar || DEFAULT_AVATAR}');`"
            >
            </router-link>
            <a href="#" @click.prevent="switchAccount($event)" class="header__user-switch" :title="$t('topBar.switchAccount')" v-if="accountsByChain.length > 1"></a>
            <router-link class="header__user-name link link--op" :to="{name:'add-account', params:{chain}}" v-if="!account.username">{{$t('topBar.addAccount')}}</router-link>
            <router-link 
              tag="a" 
              :to="{name:'chain-account-view', params:{chain, username: account.username}}" 
              class="header__user-name link link--op"
              v-if="account.username">
              {{account.username}}
            </router-link>
            <!-- <a :href="`/${chain}/@${account.username}`" class="header__user-name link link--op">
              {{account.username}}
            </a> -->
            <a class="header__profile-btn" @click="$store.dispatch('toggleDropDown')">
              <svg class="icon--header">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/settings.svg#icon"></use>
              </svg>
            </a>
            <div class="header__usermenu" :class="{'header__usermenu--opened':userDropDownToggle}" @click="closeDropDown">
              <router-link :to="{name:'publish', params:{chain}}" class="header__usermenu-item link" v-if="accountsByChain.length">{{$t('topBar.createNewPost')}}</router-link>
              <router-link :to="{name:'settings'}" class="header__usermenu-item header__usermenu-item--hr link">{{$t('topBar.settings')}}</router-link>
    					<a href="#" class="header__usermenu-item header__usermenu-item--submenu link" v-if="accounts.length > 1">{{$t('topBar.switchAccount')}}
                <div class="header__submenu">
                  <span class="header__submenu-item" 
                    v-for="account in accounts" 
                    @click.prevent="switchAccount($event, account.id)"
                    :key="account.id">
                    <span 
                      class="submenu__account-chain" 
                      :class="{'submenu__account-chain--golos': account.chain === CHAINS.GOLOS, 'submenu__account-chain--steem': account.chain === CHAINS.STEEM}"></span>
                    {{account.username}}
                  </span>
                </div>
    					</a>
    					<a href="#" class="header__usermenu-item header__usermenu-item--hr link" @click.prevent="$auth.logout()">{{$t('topBar.logout')}}</a>
    				</div>
          </div>
        </no-ssr>
      </div>
    </div>
  </header>
</template>
