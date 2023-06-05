import { mount } from '@vue/test-utils'
import Login from '../Login.vue'
import { expect, describe, it } from 'vitest'
import router from '@/router'
import { createTestingPinia } from '@pinia/testing'
import { fn } from '@vitest/spy'

describe('Login', () => {
  it('should have login fields, submit, forgot password and new account buttons', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, createTestingPinia({ createSpy: fn })],
        stubs: ['font-awesome-icon']
      }
    })

    expect(wrapper.find('#email').exists()).toBeTruthy()
    expect(wrapper.find('#password').exists()).toBeTruthy()

    expect(wrapper.find('#login').exists()).toBeTruthy()
    expect(wrapper.find('#signup').exists()).toBeTruthy()
    expect(wrapper.find('#forgot-password').exists()).toBeTruthy()
  })
})
