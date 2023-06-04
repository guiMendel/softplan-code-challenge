<script setup lang="ts">
import { auth } from '@/api/firebase'
import InputField from '@/components/InputField.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useUserStore } from '@/stores/user'
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

// ========================
// ==== FORM
// ========================

// Emails already in use
const emailsInUse = ref<string[]>([])

// Invalid emails already in use
const invalidEmails = ref<string[]>([])

// Fields
const name = ref({
  value: '',
  valid: false,
  validate: (newValue: string) => (newValue.length >= 3 ? true : 'Name needs at least 3 characters')
})

const email = ref({
  value: '',
  valid: false,
  validate: (newValue: string) => {
    if (/.+@.+\..+/.test(newValue) == false) return 'Invalid email'
    if (invalidEmails.value.includes(newValue)) return 'Invalid email'
    if (emailsInUse.value.includes(newValue)) return 'Email already in use'

    return true
  }
})

const newPassword = ref({
  value: '',
  valid: false,
  validate: (newValue: string) =>
    newValue.length >= 8 ? true : 'Password needs at least 8 characters'
})

const passwordConfirmation = ref({
  value: '',
  valid: false,
  validate: (newValue: string) =>
    newValue == newPassword.value.value ? true : "Doesn't match password"
})

// Form validation
const formIsValid = computed(
  () =>
    name.value.valid &&
    email.value.valid &&
    newPassword.value.valid &&
    passwordConfirmation.value.valid
)

// ========================
// ==== SUBMISSION
// ========================

const router = useRouter()

const { notify } = useNotificationsStore()
const { signup } = useUserStore()

const submit = () => {
  if (formIsValid.value == false) return

  const emailValue = email.value.value

  // Create the user
  signup(emailValue, newPassword.value.value, name.value.value)
    // Redirect to home
    .then(() => router.push({ name: 'home' }))
    // Handle errors
    .catch(({ code, message }) => {
      console.log('Signup failed! ' + message)

      if (code === 'auth/invalid-email') {
        invalidEmails.value.push(emailValue)
        notify('error', 'Invalid email')
      }
      if (code === 'auth/email-already-in-use') {
        emailsInUse.value.push(emailValue)
        notify('error', 'Email already in use')
      }
    })
}
</script>

<template>
  <main>
    <form class="login">
      <!-- Title -->
      <h1>share md</h1>

      <InputField name="name" v-model="name" />
      <InputField name="email" v-model="email" />
      <InputField name="newPassword" v-model="newPassword" />
      <InputField name="passwordConfirmation" v-model="passwordConfirmation" />

      <button @click.prevent="submit" id="submit" :class="formIsValid == false && 'disabled'">
        Submit
      </button>

      <p id="login">
        Already have an account? <RouterLink :to="{ name: 'login' }">Log in.</RouterLink>
      </p>
    </form>
  </main>
</template>

<style scoped lang="scss">
main {
  @import '../style/variables.scss';

  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100vh;

  background-color: $light;

  form {
    flex-direction: column;
    gap: 1rem;

    max-width: 80%;
  }
}
</style>
