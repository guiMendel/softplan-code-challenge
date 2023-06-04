<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { ref } from 'vue'

const { notify } = useNotificationsStore()

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

const login = () => {
  // notify('error', 'Invalid email')
}
</script>

<template>
  <main>
    <form class="log-in">
      <!-- Title -->
      <h1>share md</h1>

      <InputField name="email" v-model="email" />
      <InputField type="password" name="password" v-model="password" />

      <p id="forgot-password">Forgot your password?</p>
      <button
        @click.prevent="login"
        :class="(email.valid == false || password.valid == false) && 'disabled'"
        id="log-in"
      >
        Log In
      </button>

      <p>First time? <a href="#" id="sign-up">Create an account.</a></p>
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

    h1 {
      font-family: Pacifico, display;
      font-size: 2.5rem;
    }

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

    button {
      padding: 0.5rem 1rem;
      background: $strong;
      border: none;
      border-radius: $border-radius;

      // min-width: 5rem;
      width: 100%;
      text-align: center;
      align-items: center;
      justify-content: center;

      font-weight: 700;

      transition: all 100ms;
      box-shadow: 0 0.1rem 1px 1px $bad;

      &:hover {
        filter: brightness(1.1);
      }

      &:active {
        filter: brightness(0.8);
        translate: 0 0.2rem;
        box-shadow: none;
      }

      &.disabled {
        filter: saturate(0.9);
        translate: 0;
        box-shadow: none;
        color: $main;

        cursor: default;
      }
    }

    a {
      color: $bad;
      font-weight: 700;

      background-color: $transparent;

      transition: background-color 100ms;

      &:hover {
        background-color: $strong;
      }
    }
  }
}
</style>
