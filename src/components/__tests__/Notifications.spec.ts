import { describe, it, expect } from 'vitest'
import { fn } from '@vitest/spy'
import { mount } from '@vue/test-utils'
import Notifications from '../Notifications.vue'
import { createTestingPinia } from '@pinia/testing'

describe('Notifications', () => {
  it('renders nothing when no notifications', () => {
    const wrapper = mount(Notifications, {
      global: {
        plugins: [createTestingPinia({ createSpy: fn })]
      }
    })

    expect(wrapper.find('#notifications').findAll('*')).toHaveLength(0)
  })

  it('renders messages', () => {
    const messages = ['test error', 'test success']

    const wrapper = mount(Notifications, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: fn,
            initialState: {
              notifications: {
                notifications: [
                  { message: messages[0], type: 'error', timestamp: new Date() },
                  { message: messages[1], type: 'success', timestamp: new Date() }
                ]
              }
            }
          })
        ]
      }
    })

    expect(wrapper.text()).toContain(messages[0])
    expect(wrapper.text()).toContain(messages[1])
  })
})
