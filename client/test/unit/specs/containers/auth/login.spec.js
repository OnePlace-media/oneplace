import {createRouter} from '@/router'
import Login from '@/containers/auth/Login.vue'
import VueI18n from 'vue-i18n'
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: require('@/i18n/en'),
    ru: require('@/i18n/ru')
  }
})

import {shallow} from 'vue-test-utils'
const {createStore} = require('../../../../../src/store')
const store = createStore()
const router = createRouter()
const fields = ['email', 'password']
module.exports = localVue => {
  describe('@/containers/auth/Login.vue', () => {
    const wrapper = shallow(Login, {
      localVue,
      router,
      store,
      i18n,
      mocks: {
        $auth: {
          login(options) {
            if (options.data.email === 'success@test.com') {
              options.success()
            } else {
              options.error({})
            }
          }
        }
      }
    })

    it('should render correct contents, email and password input exists', () => {
      fields.forEach(field => {
        expect(wrapper.vm.$el.querySelector(`#${field}-input`)).to.not.equal(null)
      })
    })

    it('should render validation error: email-required, password-required', async function() {
      fields.forEach(field => {
        const input = wrapper.find(`#${field}-input`)
        input.element.value = ''
        input.trigger('input')
      })
      wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      fields.forEach(field => {
        expect(wrapper.vm.$el.querySelector(`#vError-${field}-required`)).to.not.equal(null)
      })
    })

    it('should render validation error: email-format', async function() {
      const input = wrapper.find('#email-input')
      input.element.value = 'invalid-email'
      input.trigger('input')
      wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$el.querySelector('#vError-email-format')).to.not.equal(null)
    })

    it('should wrongCredentials equal null, after auth request with fail answer', async function() {
      wrapper.setData({
        credentials: {
          email: 'fail@test.com',
          password: 'password'
        },
        formSubmitted: false,
        processing: false,
        wrongCredentials: false
      })
      wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formSubmitted).to.equal(true)
      expect(wrapper.vm.wrongCredentials).to.equal(true)
    })

    it('should change route, new route name equal "home", after auth request with succes answer', async function() {
      wrapper.setData({
        credentials: {
          email: 'success@test.com',
          password: 'password'
        },
        formSubmitted: false,
        processing: false,
        wrongCredentials: false
      })
      wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formSubmitted).to.equal(true)
      expect(router.history.current.name).to.eql('chain-trend')
    })
  })
}
