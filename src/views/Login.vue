<script setup lang="ts">
import { auth } from '@/api/firebase'
import InputField from '@/components/InputField.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useUserStore } from '@/stores/user'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// Login fields

// Invalid emails already in use
const invalidEmails = ref<string[]>([])

// Inexistent users
const inexistentUsers = ref<string[]>([])

const email = ref({
  value: '',
  valid: false,
  validate: (newValue: string) => {
    if (/.+@.+\..+/.test(newValue) == false) return 'Invalid email'
    if (invalidEmails.value.includes(newValue)) return 'Invalid email'
    if (inexistentUsers.value.includes(newValue)) return 'Email not registered'

    return true
  }
})

const password = ref({
  value: '',
  valid: false,
  validate: (newValue: string) =>
    newValue.length >= 8 ? true : 'Password needs at least 8 characters'
})

// Form validation
const formIsValid = computed(() => email.value.valid && password.value.valid)

const router = useRouter()

const { notify } = useNotificationsStore()
const { login } = useUserStore()

// Login action
const tryLogin = () => {
  if (formIsValid.value == false) return

  const emailValue = email.value.value

  // Create the user
  login(emailValue, password.value.value)
    // Redirect to home
    .then(() => router.push({ name: 'home' }))
    // Handle errors
    .catch(({ code, message }) => {
      console.log('Login failed! ' + message)

      if (code === 'auth/invalid-email') {
        invalidEmails.value.push(emailValue)
        notify('error', 'Invalid email')
      }
      if (code === 'auth/user-disabled') {
        notify('error', 'This account is blocked')
      }
      if (code === 'auth/user-not-found') {
        inexistentUsers.value.push(emailValue)
        notify('error', 'Email not registered')
      }
      if (code === 'auth/wrong-password') {
        notify('error', 'Invalid password')
      }
    })
}
</script>

<template>
  <main>
    <form class="login">
      <!-- Title -->
      <h1>share md</h1>

      <InputField name="email" v-model="email" />
      <InputField type="password" name="password" v-model="password" />

      <p id="forgot-password">Forgot your password?</p>
      <button @click.prevent="tryLogin" :class="formIsValid == false && 'disabled'" id="login">
        Log In
      </button>

      <p id="signup">
        First time? <RouterLink :to="{ name: 'signup' }">Create an account.</RouterLink>
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

    p#forgot-password {
      opacity: 0.6;
      font-weight: 600;
      transition: 200ms;

      margin-bottom: 1rem;

      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
