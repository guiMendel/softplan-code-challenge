<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import { useUserField } from '@/modules/useUserField'
import { useNotificationsStore } from '@/stores/notifications'
import { useCurrentUserStore } from '@/stores/currentUser'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// ========================
// ==== FORM
// ========================

// Fields
const { name, email, invalidateEmail, password: newPassword, passwordConfirmation } = useUserField()

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
const { signup } = useCurrentUserStore()

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
        notify('error', invalidateEmail(emailValue, 'invalid'))
      }
      if (code === 'auth/email-already-in-use') {
        notify('error', invalidateEmail(emailValue, 'inUse'))
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
