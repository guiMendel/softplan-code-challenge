import { mount } from '@vue/test-utils'
import Login from '../Login.vue'
// import { describe, it } from 'node:test'
import { expect, describe, it } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { fn } from '@vitest/spy'

describe('Login', () => {
  it('should have login fields, submit, forgot password and new account buttons', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia({ createSpy: fn })]
      }
    })

    expect(wrapper.find('#email').exists()).toBeTruthy()
    expect(wrapper.find('#password').exists()).toBeTruthy()

    expect(wrapper.find('#log-in').exists()).toBeTruthy()
    expect(wrapper.find('#sign-up').exists()).toBeTruthy()
    expect(wrapper.find('#forgot-password').exists()).toBeTruthy()
  })
})
