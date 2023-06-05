import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputField from '../InputField.vue'
import { ref } from 'vue'
import type { Field } from '@/modules/useUserField'

describe('InputField', () => {
  it('should start showing placeholder', () => {
    const field = ref<Field>({
      name: 'name',
      value: '',
      valid: false
    })

    const wrapper = mount(InputField, {
      props: { modelValue: field.value },
      global: { stubs: ['font-awesome-icon'] }
    })

    expect(wrapper.text()).toContain('name')
  })

  it('should update model value', async () => {
    const field = ref<Field>({
      name: 'name',
      value: '',
      valid: false
    })

    const placeholder = 'placeholder test'

    const wrapper = mount(InputField, {
      props: {
        modelValue: field.value,
        'onUpdate:modelValue': (newValue: typeof field.value) => (field.value = newValue),
        placeholder
      },
      global: { stubs: ['font-awesome-icon'] }
    })

    const newValue = 'test value'

    await wrapper.find('input').setValue(newValue)

    expect(field.value.value).toBe(newValue)
  })

  it('should set valid to false when appropriate', async () => {
    const field = ref<Field>({
      name: 'name',
      value: '',
      valid: false,
      validate: (newValue: string): string | true => 'example error'
    })

    const wrapper = mount(InputField, {
      props: {
        modelValue: field.value,
        'onUpdate:modelValue': (newValue: typeof field.value) => (field.value = newValue)
      },
      global: { stubs: ['font-awesome-icon'] }
    })

    await wrapper.find('input').setValue('a value')

    expect(field.value.valid).toBeFalsy()
  })

  it('should set valid to true when field is valid', async () => {
    const field = ref<Field>({
      name: 'name',
      value: '',
      valid: false,
      validate: (newValue: string): string | true => true
    })

    const wrapper = mount(InputField, {
      props: {
        modelValue: field.value,
        'onUpdate:modelValue': (newValue: typeof field.value) => (field.value = newValue)
      },
      global: { stubs: ['font-awesome-icon'] }
    })

    await wrapper.find('input').setValue('a value')

    expect(field.value.valid).toBeTruthy()
  })
})
