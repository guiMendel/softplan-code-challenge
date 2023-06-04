import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputField from '../InputField.vue'
import { ref } from 'vue'

describe('InputField', () => {
  it('should start showing placeholder', () => {
    const field = ref({
      value: '',
      valid: false
    })

    const wrapper = mount(InputField, {
      props: { modelValue: field.value, name: 'test' }
    })

    expect(wrapper.text()).toContain('test')
  })

  it('should update model value', async () => {
    const field = ref({
      value: '',
      valid: false
    })

    const placeholder = 'placeholder test'

    const wrapper = mount(InputField, {
      props: {
        modelValue: field.value,
        'onUpdate:modelValue': (newValue: typeof field.value) => (field.value = newValue),
        placeholder,
        name: 'test'
      }
    })

    const newValue = 'test value'

    await wrapper.find('input').setValue(newValue)

    expect(field.value.value).toBe(newValue)
  })

  it('should set valid to false when appropriate', async () => {
    const field = ref({
      value: '',
      valid: false,
      validate: (newValue: string): string | true => 'example error'
    })

    const wrapper = mount(InputField, {
      props: {
        modelValue: field.value,
        'onUpdate:modelValue': (newValue: typeof field.value) => (field.value = newValue),
        name: 'test'
      }
    })

    await wrapper.find('input').setValue('a value')

    expect(field.value.valid).toBeFalsy()
  })

  it('should set valid to true when field is valid', async () => {
    const field = ref({
      value: '',
      valid: false,
      validate: (newValue: string): string | true => true
    })

    const wrapper = mount(InputField, {
      props: {
        modelValue: field.value,
        'onUpdate:modelValue': (newValue: typeof field.value) => (field.value = newValue),
        name: 'test'
      }
    })

    await wrapper.find('input').setValue('a value')

    expect(field.value.valid).toBeTruthy()
  })
})
