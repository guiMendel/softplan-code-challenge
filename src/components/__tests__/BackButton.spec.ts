import { describe, it, expect, afterEach, vi, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import BackButton from '../BackButton.vue'
import { useRouter } from 'vue-router'

vi.mock('vue-router')

describe('BackButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should restore router history', async () => {
    // Mock the back function
    const back = vi.fn()

    ;(useRouter as Mock).mockImplementationOnce(() => ({
      back
    }))

    // Mount the component
    const wrapper = mount(BackButton, {
      global: {
        stubs: ['router-link']
      }
    })

    // Trigger it
    await wrapper.find('#back-button').trigger('click')

    expect(back).toHaveBeenCalledOnce()
  })
})
