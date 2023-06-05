import type { Field } from '@/modules/useUserField'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useNotificationsStore } from './notifications'

export const useInputStore = defineStore('input', () => {
  // ==============================================
  // === GENERAL INTERFACE
  // ==============================================

  // Accepts the field values
  const accept = () => {
    // Validate fields
    for (const field of fields.value) if (field.valid == false) return

    // Resolve
    if (resolveCache.value != null) resolveCache.value(fields.value)
    if (confirmationResolveCache.value != null) confirmationResolveCache.value(true)

    // Clear
    clearInputData()
  }

  // Cancel input request
  const cancel = (reason?: string) => {
    // Call reject
    if (rejectCache.value != null) rejectCache.value(reason)
    if (confirmationResolveCache.value != null) confirmationResolveCache.value(false)

    // Clear
    clearInputData()
  }

  // Clears all input data
  const clearInputData = () => {
    fields.value = []
    title.value = ''

    confirmationTitle.value = ''
    confirmationYes.value = ''
    confirmationNo.value = ''

    resolveCache.value = null
    rejectCache.value = null
    confirmationResolveCache.value = null
  }

  // ==============================================
  // === INPUT REQUEST
  // ==============================================

  // Fields to gather input for
  const fields = ref<Field[]>([])

  // Current title of input request
  const title = ref('')

  // Whether is in process of input
  const hasOngoingInput = computed(() => resolveCache.value != null && rejectCache.value != null)

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

  // Stored resolve for input promise
  const resolveCache = ref<null | ((value: Field[] | PromiseLike<Field[]>) => void)>(null)

  // Stored reject for input promise
  const rejectCache = ref<null | ((reason?: any) => void)>(null)

  // ==============================================
  // === CONFIRMATION REQUEST
  // ==============================================

  const confirmationTitle = ref('')
  const confirmationYes = ref('')
  const confirmationNo = ref('')

  // Whether is in process of input
  const hasOngoingConfirmation = computed(() => confirmationResolveCache.value != null)

  // Requests confirmation from the client and eventually resolves to true or false
  const getConfirmation = (title: string, confirmLabel = 'Confirm', cancelLabel = 'Cancel') =>
    new Promise<boolean>((resolve) => {
      confirmationTitle.value = title
      confirmationYes.value = confirmLabel
      confirmationNo.value = cancelLabel

      confirmationResolveCache.value = resolve
    })

  // Stored resolve for confirmation promise
  const confirmationResolveCache = ref<null | ((value: boolean | PromiseLike<boolean>) => void)>(
    null
  )

  return {
    accept,
    cancel,
    getInput,
    title,
    fields,
    hasOngoingInput,
    getConfirmation,
    confirmationTitle,
    confirmationYes,
    confirmationNo,
    hasOngoingConfirmation
  }
})
