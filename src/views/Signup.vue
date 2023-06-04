<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import { computed, ref } from 'vue'

// ========================
// ==== FORM
// ========================

// Fields
const nickname = ref({
  value: '',
  valid: false,
  validate: (newValue: string) =>
    newValue.length >= 3 ? true : 'Nickname needs at least 3 characters'
})

const email = ref({
  value: '',
  valid: false,
  validate: (newValue: string) => (/.+@.+/.test(newValue) ? true : 'Invalid email')
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
    nickname.value.valid &&
    email.value.valid &&
    newPassword.value.valid &&
    passwordConfirmation.value.valid
)

// ========================
// ==== SUBMISSION
// ========================


</script>

<template>
  <main>
    <form class="login">
      <!-- Title -->
      <h1>share md</h1>

      <InputField name="nickname" v-model="nickname" />
      <InputField name="email" v-model="email" />
      <InputField name="newPassword" v-model="newPassword" />
      <InputField name="passwordConfirmation" v-model="passwordConfirmation" />

      <button @click.prevent="" id="submit" :class="formIsValid == false && 'disabled'">
        Submit
      </button>

      <p id="login">
        Already have an account? <RouterLink :to="{ name: 'login' }">Log in.</RouterLink>
      </p>
    </form>
  </main>
</template>

<style lang="scss">
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