// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useInputStore } from '../input'
import type { Field } from '@/modules/useUserField'

describe('Input Store: input fields', () => {
  beforeEach(() => {
    // creates a store for the test
    setActivePinia(createPinia())
  })

  it('sets the input fields', () => {
    const inputStore = useInputStore()

    const testField: Field = {
      name: 'name',
      value: '',
      valid: false
    }

    const testTitle = 'test title'

    // Request input on this field
    inputStore.getInput(testTitle, testField)

    // Check if it was stored
    expect(inputStore.fields).toHaveLength(1)
    expect(inputStore.title).toBe(testTitle)
  })

  it('resolves to new data', async () => {
    const inputStore = useInputStore()

    const testField: Field = {
      name: 'name',
      value: '',
      valid: true
    }

    // Request input on this field
    const inputPromise = inputStore.getInput('For test', testField)

    // Set new data
    const newData = 'new data'
    inputStore.fields[0].value = newData

    // Accept it
    inputStore.accept()

    // Check if resolved to new data
    expect((await inputPromise)[0].value).toBe(newData)
  })

  it('rejects with reason', async () => {
    const inputStore = useInputStore()

    const testField: Field = {
      name: 'name',
      value: '',
      valid: false
    }

    // Request input on this field
    const inputPromise = inputStore.getInput('For test', testField)

    // Checks if promise is rejected
    let promiseRejectedReason = ''

    // Cancel it
    const reason = 'test reason'
    inputStore.cancel(reason)

    try {
      await inputPromise
    } catch (reason: any) {
      promiseRejectedReason = reason
    }

    // Check if promise rejected with reason
    expect(promiseRejectedReason).toBe(reason)
  })
})

describe('Input Store: confirmation', () => {
  beforeEach(() => {
    // creates a store for the test
    setActivePinia(createPinia())
  })

  it('sets the confirmation labels', () => {
    const inputStore = useInputStore()

    const testTitle = 'test title'
    const testYes = 'test yes'
    const testNo = 'test no'

    // Request input on this field
    inputStore.getConfirmation(testTitle, testYes, testNo)

    // Check if it was stored
    expect(inputStore.confirmationTitle).toBe(testTitle)
    expect(inputStore.confirmationYes).toBe(testYes)
    expect(inputStore.confirmationNo).toBe(testNo)
  })

  it('resolves to true when accepted', async () => {
    const inputStore = useInputStore()

    // Request input on this field
    const inputPromise = inputStore.getConfirmation('For test')

    // Accept it
    inputStore.accept()

    // Check if resolved to new data
    expect(await inputPromise).toBeTruthy()
  })

  it('resolves to false when canceled', async () => {
    const inputStore = useInputStore()

    // Request input on this field
    const inputPromise = inputStore.getConfirmation('For test')

    // Cancel it
    inputStore.cancel()

    // Check if resolved to new data
    expect(await inputPromise).toBeFalsy()
  })
})
