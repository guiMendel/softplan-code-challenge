import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Notifications from '../Notifications.vue'

describe('Notifications', () => {
  it('renders nothing when no notifications', () => {
    const wrapper = mount(Notifications, { props: { notifications: [] } })

    expect(wrapper.find('#notifications').findAll('*')).toHaveLength(0)
  })

  it('renders messages', () => {
    const messages = ['test error', 'test success']

    const wrapper = mount(Notifications, {
      props: {
        notifications: [
          { message: messages[0], type: 'error', timestamp: new Date().toJSON() },
          { message: messages[1], type: 'success', timestamp: new Date().toJSON() }
        ]
      }
    })

    expect(wrapper.text()).toContain(messages[0])
    expect(wrapper.text()).toContain(messages[1])
  })
})
