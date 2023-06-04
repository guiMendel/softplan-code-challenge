import { RouterLinkStub, mount } from '@vue/test-utils'
import Signup from '../Signup.vue'
// import { describe, it } from 'node:test'
import { expect, describe, it } from 'vitest'
import router from '@/router'

describe('Signup', () => {
  it('should have signup fields: email, password, nickname and submit button. Should have login redirect', () => {
    const wrapper = mount(Signup, { global: { plugins: [router] } })

    expect(wrapper.find('#email').exists()).toBeTruthy()
    expect(wrapper.find('#newPassword').exists()).toBeTruthy()
    expect(wrapper.find('#nickname').exists()).toBeTruthy()

    expect(wrapper.find('#login').exists()).toBeTruthy()

    expect(wrapper.find('#submit').exists()).toBeTruthy()
  })
})
