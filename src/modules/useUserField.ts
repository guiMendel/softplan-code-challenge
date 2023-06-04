import { ref } from 'vue'

export const useUserField = () => {
  type invalidEmailsType = {
    invalid: string[]
    inUse: string[]
    inexistent: string[]
  }

  // Errors for invalid email types
  const errorFor = {
    invalid: 'Invalid email',
    inUse: 'Email already in use',
    inexistent: 'Email not registered'
  }

  // Invalid emails
  const invalidEmails = ref<invalidEmailsType>({ invalid: [], inUse: [], inexistent: [] })

  // Set an email as invalid
  const invalidateEmail = (email: string, reason: keyof invalidEmailsType) => {
    invalidEmails.value[reason].push(email)

    return errorFor[reason]
  }

  const email = ref({
    value: '',
    valid: false,
    validate: (newValue: string) => {
      if (/.+@.+\..+/.test(newValue) == false) return 'Invalid email'

      for (const reason in invalidEmails.value)
        if (invalidEmails.value[reason as keyof invalidEmailsType].includes(newValue))
          return errorFor[reason as keyof invalidEmailsType]

      return true
    }
  })

  const password = ref({
    value: '',
    valid: false,
    validate: (newValue: string) =>
      newValue.length >= 8 ? true : 'Password needs at least 8 characters'
  })

  const passwordConfirmation = ref({
    value: '',
    valid: false,
    validate: (newValue: string) =>
      newValue == password.value.value ? true : "Doesn't match password"
  })

  const name = ref({
    value: '',
    valid: false,
    validate: (newValue: string) => {
      if (newValue.length < 3) return 'Name needs at least 3 characters'
      if (newValue.split(' ').length < 2) return 'Please provide first and last name'

      return true
    }
  })

  return { email, invalidateEmail, name, password, passwordConfirmation }
}
