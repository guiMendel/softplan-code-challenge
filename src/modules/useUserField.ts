import type { User } from '@/types/User.interface'
import { ref, type Ref, watch } from 'vue'

export interface Field {
  name: keyof User | 'password' | 'passwordConfirmation'
  value: string
  valid: boolean
  validate?: (value: string) => true | string
}

export const useUserField = () => {
  type invalidEmailsType = {
    invalid: string[]
    inUse: string[]
    inexistent: string[]
  }

  // Converts a login error code to a human readable message
  const getErrorForCode = (code: string) => {
    if (code == 'auth/invalid-email') return 'Invalid email'
    if (code == 'auth/user-disabled') return 'This account is blocked'
    if (code == 'auth/user-not-found') return 'Email not registered'
    if (code == 'auth/wrong-password') return 'Invalid password'
    return 'Invalid'
  }

  // Errors for invalid email types
  const errorFor = {
    invalid: getErrorForCode('auth/invalid-email'),
    inUse: getErrorForCode('auth/user-not-found'),
    inexistent: 'Email not registered'
  }

  // Invalid emails
  const invalidEmails = ref<invalidEmailsType>({ invalid: [], inUse: [], inexistent: [] })

  // Set an email as invalid
  const invalidateEmail = (email: string, reason: keyof invalidEmailsType) => {
    invalidEmails.value[reason].push(email)

    return errorFor[reason]
  }

  const email: Ref<Field> = ref({
    name: 'email',
    value: '',
    valid: false,
    validate: (newValue: string) => {
      if (/.+@.+\..+/.test(newValue) == false) return 'Invalid email'
      if (newValue.length > 20) return 'Too many characters'

      for (const reason in invalidEmails.value)
        if (invalidEmails.value[reason as keyof invalidEmailsType].includes(newValue))
          return errorFor[reason as keyof invalidEmailsType]

      return true
    }
  })

  const password: Ref<Field> = ref({
    name: 'password',
    value: '',
    valid: false,
    validate: (newValue: string) => {
      if (newValue.length < 6) return 'Password needs at least 6 characters'
      if (newValue.length > 20) return 'Too many characters'

      return true
    }
  })

  const matchesPassword = (value: string): string | true => {
    if (value == '' || value !== password.value.value) return "Doesn't match password"

    return true
  }

  const passwordConfirmation: Ref<Field> = ref({
    name: 'passwordConfirmation',
    value: '',
    valid: false,
    validate: matchesPassword
  })

  // Keep confirmation synced to password
  watch(
    password,
    () =>
      (passwordConfirmation.value.valid =
        matchesPassword(passwordConfirmation.value.value) === true)
  )

  const name: Ref<Field> = ref({
    name: 'name',
    value: '',
    valid: false,
    validate: (newValue: string) => {
      if (newValue.length < 3) return 'Name needs at least 3 characters'
      if (/.+ .+/.test(newValue) == false) return 'Please provide first and last name'
      if (newValue.length > 20) return 'Too many characters'

      return true
    }
  })

  const about: Ref<Field> = ref({
    name: 'about',
    value: '',
    valid: false,
    validate: (newValue: string) => {
      if (newValue.length > 400) return 'Too many characters'

      return true
    }
  })

  const color: Ref<Field> = ref({
    name: 'color',
    value: '',
    valid: false,
    validate: (newValue: string) => {
      if (/^#[a-fA-F0-9]{6}$/.test(newValue) == false) return 'Invalid color'

      return true
    }
  })

  return {
    email,
    invalidateEmail,
    name,
    password,
    passwordConfirmation,
    about,
    color,
    getErrorForCode
  }
}
