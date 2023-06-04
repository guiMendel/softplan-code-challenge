<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Login fields

const email = ref({
  value: '',
  valid: false,
  validate: (newValue: string) => (/.+@.+/.test(newValue) ? true : 'Invalid email')
})

const password = ref({
  value: '',
  valid: false,
  validate: (newValue: string) =>
    newValue.length >= 8 ? true : 'Password needs at least 8 characters'
})

// Login action
const login = () => {
  // notify('error', 'Invalid email')
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
      <button
        @click.prevent="login"
        :class="(email.valid == false || password.valid == false) && 'disabled'"
        id="login"
      >
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
