import { mount } from '@vue/test-utils'
import Login from '../Login.vue'
// import { describe, it } from 'node:test'
import { expect, describe, it } from 'vitest'

describe('Login', () => {
  it('should have login fields, submit, forgot password and new account buttons', () => {
    const wrapper = mount(Login)

    expect(wrapper.find('#email').exists()).toBeTruthy()
    expect(wrapper.find('#password').exists()).toBeTruthy()

    expect(wrapper.find('#log-in').exists()).toBeTruthy()
    expect(wrapper.find('#sign-up').exists()).toBeTruthy()
    expect(wrapper.find('#forgot-password').exists()).toBeTruthy()
  })

  it('should reject invalid emails', async () => {
    const wrapper = mount(Login)

    await wrapper.find('#email').setValue('bogey')

    await wrapper.find('#log-in').trigger('click')

    expect(wrapper.find('#error').exists()).toBeTruthy()
  })
})
