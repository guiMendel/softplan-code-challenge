import { RouterLinkStub, mount } from '@vue/test-utils'
import Signup from '../Signup.vue'
// import { describe, it } from 'node:test'
import { expect, describe, it } from 'vitest'
import router from '@/router'
import { createTestingPinia } from '@pinia/testing'
import { fn } from '@vitest/spy'

describe('Signup', () => {
  it('should have signup fields: email, password, name and submit button. Should have login redirect', () => {
    const wrapper = mount(Signup, {
      global: { plugins: [router, createTestingPinia({ createSpy: fn })] }
    })

    expect(wrapper.find('#email').exists()).toBeTruthy()
    expect(wrapper.find('#newPassword').exists()).toBeTruthy()
    expect(wrapper.find('#name').exists()).toBeTruthy()

    expect(wrapper.find('#login').exists()).toBeTruthy()

    expect(wrapper.find('#submit').exists()).toBeTruthy()
  })
})
