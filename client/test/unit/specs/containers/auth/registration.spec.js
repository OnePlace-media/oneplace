import {createRouter} from '@/router'
import Registration from '@/containers/auth/Registration.vue'
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
const fields = ['email', 'password', 'passwordRepeat']
module.exports = localVue => {
  const MockAdapter = require('axios-mock-adapter')
  const mock = new MockAdapter(localVue.axios)

  describe('@/containers/auth/Registration.vue', () => {
    const wrapper = shallow(Registration, {
      localVue,
      router,
      store,
      i18n,
      mocks: {
        $locale: {
          current() {
            return 'en'
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
      const _fields = fields.filter(v => v !== 'passwordRepeat')
      _fields.forEach(field => {
        expect(wrapper.vm.$el.querySelector(`#vError-${field}-required`)).to.equal(null)
        const input = wrapper.find(`#${field}-input`)
        input.element.value = ''
        input.trigger('input')
      })
      await wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      _fields.forEach(field => {
        expect(wrapper.vm.$el.querySelector(`#vError-${field}-required`)).to.not.equal(null)
      })
    })

    it('should render validation error: email-format', async function() {
      expect(wrapper.vm.$el.querySelector('#vError-email-format')).to.equal(null)
      const input = wrapper.find('#email-input')
      input.element.value = 'invalid-email'
      input.trigger('input')
      await wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$el.querySelector('#vError-email-format')).to.not.equal(null)
    })

    it('should render validation error: password-repeat', async function() {
      expect(wrapper.vm.$el.querySelector('#vError-password-repeat')).to.equal(null)
      const inputPass = wrapper.find('#password-input')
      inputPass.element.value = 'password'
      inputPass.trigger('input')
      const inputRepeat = wrapper.find('#passwordRepeat-input')
      inputRepeat.element.value = 'password-diff'
      inputRepeat.trigger('input')
      inputRepeat.trigger('keyup')
      await wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$el.querySelector('#vError-password-repeat')).to.not.equal(null)
    })

    it('should render validation error: email-uniqueness', async function() {
      expect(wrapper.vm.$el.querySelector('#vError-email-uniqueness')).to.equal(null)
      wrapper.setData({
        model: {
          email: 'test@mail.com',
          password: 'password'
        },
        passwordRepeat: 'password',
        formSubmitted: false,
        formSuccessSubmitted: false,
        processing: false
      })
      const url = `users?redirect=${encodeURIComponent(window.location.origin)}`
      mock.onPost(url).replyOnce(422, {
        error: {
          statusCode: 422,
          name: 'ValidationError',
          details: {
            context: 'user',
            codes: {
              email: ['uniqueness']
            },
            messages: {
              email: ['email is not unique']
            }
          }
        }
      })
      await wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$el.querySelector('#vError-email-uniqueness')).to.not.equal(null)
    })

    it('should render message after success registration', async function() {
      wrapper.vm.errors.remove('email', 'uniqueness')
      await wrapper.vm.$nextTick()
      wrapper.setData({
        model: {
          email: 'test@mail.com',
          password: 'password'
        },
        passwordRepeat: 'password',
        formSubmitted: false,
        formSuccessSubmitted: false,
        processing: false
      })
      const url = `users?redirect=${encodeURIComponent(window.location.origin)}`
      mock.onPost(url).replyOnce(201, {
        id: 'some-id',
        email: 'test@mail.com'
      })
      await wrapper.vm.onSubmit()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formSubmitted).to.equal(true)
      expect(wrapper.vm.$el.querySelector('#success-registration-header')).to.not.equal(null)
    })
  })
}
