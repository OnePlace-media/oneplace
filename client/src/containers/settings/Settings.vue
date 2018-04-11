<script>
import TagsForm from '../../components/settings/TagsForm.vue'
import AccountAttachForm from '../../components/settings/AccountAttachForm.vue'
import AccountRemoveForm from '../../components/settings/AccountRemoveForm.vue'
const CONSTANTS = require('@oneplace/constants')
export default {
  name: 'Settings',
  components: {
    TagsForm,
    AccountAttachForm,
    AccountRemoveForm
  },
  data() {
    return {
      attachFormShow: false,
      accountRemove: null
    }
  },
  methods: {
    closeAccountForm() {
      this.attachFormShow = false
    },
    successAttachform() {
      this.$auth.fetch()
      this.closeAccountForm()
    },
    removeAccountByUserName(chain, username) {
      const account = this.accounts.find(
        acc => acc.chain === chain && acc.username === username
      )
      if (account) {
        this.removeAccount(account)
      }
    },
    removeAccount(account) {
      this.accountRemove = null
      this.$store
        .dispatch('removeAccount', {
          id: this.$auth.user().id,
          chain: account.chain,
          username: account.username
        })
        .then(() => {
          this.$auth.fetch()
        })
        .catch(err => {
          if (err.response.status === 405) {
            this.accountRemove = account
          }
        })
    }
  },
  mounted() {
    const stateInit = () => {
      if (this.$auth.check()) {
        this.$store.commit('setTagsFormChain', null)
        const golosDefaultTags = CONSTANTS.DEFAULT.TAGS.g.map(tag => {
          tag.chain = 'g'
          return tag
        })
        const steemDefaultTags = CONSTANTS.DEFAULT.TAGS.s.map(tag => {
          tag.chain = 's'
          return tag
        })

        const golosTags = this.$auth
          .user()
          .tags.filter(tag => tag.chain === 'g')
        const steemTags = this.$auth
          .user()
          .tags.filter(tag => tag.chain === 's')
        let tags = []
        if (golosTags.length) tags = tags.concat(golosTags)
        else tags = tags.concat(golosDefaultTags)

        if (steemTags.length) tags = tags.concat(steemTags)
        else tags = tags.concat(steemDefaultTags)

        this.$store.commit('setInitFormTags', tags)

        if (this.$route.query.rm) {
          const rm = this.$route.query.rm
          const [chain, username] = decodeURIComponent(rm).split(':')
          this.removeAccountByUserName(chain, username)
          this.$router.replace({ name: 'settings' })
        }
      }
    }
    if (this.$auth.ready()) stateInit()
    else this.$auth.ready(stateInit)
  },
  beforeRouteLeave(to, from, next) {
    this.$auth.fetch({
      success: () => next()
    })
  },
  destroyed() {
    this.$store.commit('setInitFormTags', [])
  },
  computed: {
    CHAINS() {
      return CONSTANTS.BLOCKCHAIN.SOURCE
    },
    accounts() {
      return this.$auth.user().accounts
    },
    steemTags: {
      set() {},
      get() {}
    },
    golosTags() {
      return this.$auth
        .user()
        .tags.filter(tag => tag.chain === this.CHAINS.GOLOS)
    }
  }
}
</script>

<template>
  <no-ssr>
    <section class="main-content" v-if="$auth && $auth.ready() && $auth.check()">
      <section class="tag-block">
        <header class="tag-block__header container">
          <h1 class="h1 tag-block__title">{{$t('settings.header')}}</h1>
        </header>
        <section class="tag-block__body">
          <div class="container settings__wrapper">
            <div class="settings__accounts" :class="{'settings__accounts--active':attachFormShow || accountRemove}">
              <div class="settings__block-header aside-header">
                <h4 class="h4 aside-header__title">{{$t('settings.blockchainAccounts')}}</h4>
              </div>
              <div class="settings__block-body">
              <div class="settings__accounts-wrapper">
                <ul class="settings__accounts-list" v-if="accounts.length">
                  <li class="settings__account" v-for="account in accounts" :key="account.id">
                    <span class="settings__account-chain" :class="{'settings__account-chain--steem':account.chain === CHAINS.STEEM, 'settings__account-chain--golos':account.chain === CHAINS.GOLOS}"></span>
                    <span class="settings__account-name">{{account.username}}</span>
                    <a class="settings__remove-btn" 
                      @click.prevent="removeAccount(account)" :title="$t('accountForm.removeAccount')">
                      <svg class="settings__icon">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/img/icons-sprite.svg#delete"></use>
                        </svg>
                      </a>
                  </li>
                </ul>
                <div class="settings__no-accounts" v-if="!accounts.length">{{$t('settings.noAddedAccountsYet')}}</div>
                <a href="#" class="btn-expand btn-expand--accounts" v-show="!attachFormShow && !accountRemove" @click.prevent="attachFormShow = true"></a>
              </div>
              <account-attach-form view="settings" v-if="attachFormShow && !accountRemove" @success="closeAccountForm" @close="closeAccountForm"></account-attach-form>
              <account-remove-form :account="accountRemove" @cancel="accountRemove = null" @success="removeAccount" v-if="accountRemove"></account-remove-form>
            </div>
            </div>
            <div class="settings__tags">
              <div class="settings__block-header aside-header">
                <h4 class="h4 aside-header__title">{{$t('settings.categoriesList')}}</h4>
              </div>
              <div class="settings__block-body settings__tags-body">
                <tags-form view="settings"></tags-form>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  </no-ssr>
</template>
