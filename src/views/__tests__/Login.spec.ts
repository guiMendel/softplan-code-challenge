import { RouterLinkStub, mount } from '@vue/test-utils'
import Login from '../Login.vue'
// import { describe, it } from 'node:test'
import { expect, describe, it } from 'vitest'
import router from '@/router'

describe('Login', () => {
  it('should have login fields, submit, forgot password and new account buttons', () => {
    const wrapper = mount(Login, { global: { plugins: [router] } })

    expect(wrapper.find('#email').exists()).toBeTruthy()
    expect(wrapper.find('#password').exists()).toBeTruthy()

    expect(wrapper.find('#login').exists()).toBeTruthy()
    expect(wrapper.find('#signup').exists()).toBeTruthy()
    expect(wrapper.find('#forgot-password').exists()).toBeTruthy()
  })
})
