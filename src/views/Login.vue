<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'
import { ref } from 'vue'

const { notify } = useNotificationsStore()

const email = ref('')
const password = ref('')

const login = () => {
  notify('error', 'Invalid email')
}
</script>

<template>
  <main>
    <form class="log-in">
      <!-- Title -->
      <h1>share md</h1>

      <input type="text" id="email" placeholder="email" v-model="email" />
      <input type="password" id="password" placeholder="password" v-model="password" />

      <p id="forgot-password">Forgot your password?</p>
      <button @click.prevent="login" id="log-in">Log In</button>

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

    h1 {
      font-family: Pacifico, display;
      font-size: 2.5rem;
    }

    input {
      border-bottom: 2px solid $text;
      background: none;
      font-weight: 600;
      cursor: pointer;

      width: 15rem;

      padding: 0.3rem 0;

      &::placeholder {
        opacity: 0.4;
      }
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
