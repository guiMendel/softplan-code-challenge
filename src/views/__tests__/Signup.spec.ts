import { mount } from '@vue/test-utils'
import Signup from '../Signup.vue'
// import { describe, it } from 'node:test'
import { expect, describe, it } from 'vitest'

describe('Signup', () => {
  it('should have signup fields: email, password, nickname and submit button', () => {
    const wrapper = mount(Signup)

    expect(wrapper.find('#email').exists()).toBeTruthy()
    expect(wrapper.find('#password').exists()).toBeTruthy()
    expect(wrapper.find('#nickname').exists()).toBeTruthy()

    expect(wrapper.find('#submit').exists()).toBeTruthy()
  })
})
