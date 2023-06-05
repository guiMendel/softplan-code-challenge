import type { Field } from '@/modules/useUserField'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInputStore = defineStore('input', () => {
  // ==============================================
  // === INPUT REQUEST INTERFACE
  // ==============================================

  // Fields to gather input for
  const fields = ref<Field[]>([])

  // Current title of input request
  const title = ref('')

  // Accepts the field values
  const accept = () => {
    // Validate fields
    for (const field of fields.value) if (field.valid == false) return

    // Resolve on them
    resolveCache.value(fields.value)

    // Clear
    clearInputData()
  }

  // Cancel input request
  const cancel = (reason?: string) => {
    // Call reject
    rejectCache.value(reason)

    // Clear
    clearInputData()
  }

  // Asks the user for some input, and eventually returns the result
  const getInput = (inputTitle: string, ...inputFields: Field[]) => {
    // Store requested data
    title.value = inputTitle
    fields.value = inputFields

    // Store promise methods
    return new Promise<Field[]>((resolve, reject) => {
      resolveCache.value = resolve
      rejectCache.value = reject
    })
  }

  // ==============================================
  // === INPUT REQUEST IMPLEMENTATION
  // ==============================================

  // Stored resolve for input promise
  const resolveCache = ref<(value: Field[] | PromiseLike<Field[]>) => void>(() => {})

  // Stored reject for input promise
  const rejectCache = ref<(reason?: any) => void>(() => {})

  // Clears all input data
  const clearInputData = () => {
    fields.value = []
    title.value = ''

    resolveCache.value = () => {}
    rejectCache.value = () => {}
  }

  return { getInput, accept, cancel, fields, title }
})