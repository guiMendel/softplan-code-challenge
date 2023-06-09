<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import { useUserField } from '@/modules/useUserField'
import { useNotificationsStore } from '@/stores/notifications'
import { useCurrentUserStore } from '@/stores/currentUser'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Login fields
const { email, password, invalidateEmail } = useUserField()

// Form validation
const formIsValid = computed(() => email.value.valid && password.value.valid)

const router = useRouter()

const { notify } = useNotificationsStore()
const { login } = useCurrentUserStore()
const { getErrorForCode } = useUserField()

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

      notify('error', getErrorForCode(code))

      if (code === 'auth/invalid-email') invalidateEmail(emailValue, 'invalid')

      if (code === 'auth/user-not-found') invalidateEmail(emailValue, 'inexistent')
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
