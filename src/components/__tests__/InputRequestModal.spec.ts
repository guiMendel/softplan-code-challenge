import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputRequestModal from '../InputRequestModal.vue'
import { createTestingPinia } from '@pinia/testing'
import { fn } from '@vitest/spy'
import { useInputStore } from '@/stores/input'
import type { Field } from '@/modules/useUserField'
import { nextTick } from 'vue'

describe('InputRequestModal', () => {
  it('should start hidden', async () => {
    // Mount the component
    const wrapper = mount(InputRequestModal, {
      global: {
        plugins: [createTestingPinia({ createSpy: fn })],
        stubs: ['font-awesome-icon']
      }
    })

    expect(wrapper.text()).toBe('')
  })

  it('should display input request fields and title', async () => {
    // Mount the component
    const wrapper = mount(InputRequestModal, {
      global: {
        plugins: [createTestingPinia({ createSpy: fn, stubActions: false })],
        stubs: ['font-awesome-icon']
      }
    })

    // Get store
    const inputStore = useInputStore()

    // Request input
    const title = 'test title'
    const testFieldName = 'name'
    const testFieldValue = 'test value'

    const testField: Field = {
      name: testFieldName,
      value: testFieldValue,
      valid: true
    }

    inputStore.getInput(title, testField)

    // Wait for vue update
    await nextTick()

    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain(testFieldName)
    expect(wrapper.find('input').element.value).toBe(testFieldValue)
  })

  it('should accept input on submit', async () => {
    // Mount the component
    const wrapper = mount(InputRequestModal, {
      global: {
        plugins: [createTestingPinia({ createSpy: fn, stubActions: false })],
        stubs: ['font-awesome-icon']
      }
    })

    // Get store
    const inputStore = useInputStore()

    // Request input
    const testField: Field = {
      name: 'name',
      value: 'test value',
      valid: true
    }

    inputStore.getInput('test title', testField)

    // Wait for vue update
    await nextTick()

    // Trigger form submission
    await wrapper.find('form').trigger('submit')

    // Accept should have been called
    expect(inputStore.accept).toHaveBeenCalledOnce()
  })

  it('should reject input on cancel', async () => {
    // Mount the component
    const wrapper = mount(InputRequestModal, {
      global: {
        plugins: [createTestingPinia({ createSpy: fn, stubActions: false })],
        stubs: ['font-awesome-icon']
      }
    })

    // Get store
    const inputStore = useInputStore()

    // Request input
    const testField: Field = {
      name: 'name',
      value: 'test value',
      valid: true
    }

    inputStore.getInput('test title', testField).catch(() => {})

    // Wait for vue update
    await nextTick()

    // Click cancel
    await wrapper.find('#cancel-input').trigger('click')

    // Input should be cancelled
    expect(inputStore.cancel).toHaveBeenCalledOnce()
  })
})
