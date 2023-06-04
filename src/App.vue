<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import Notifications from './components/Notifications.vue'
import UserPanel from './components/UserPanel.vue'
import BackButton from './components/BackButton.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from './stores/user'
import { computed, ref, watch } from 'vue'

const { currentUser } = storeToRefs(useUserStore())
const router = useRouter()

// ===================================================
// === REACTING TO AUTHENTICATION CHANGES
// ===================================================

watch(currentUser, (newUser) => {
  // When user is signed out and route requires authentication, redirect to login
  if (newUser == null && router.currentRoute.value.meta.requiresAuth) {
    router.push({ name: 'login' })
  }

  // When user is signed in and route requires no authentication, redirect to home
  if (newUser != null && router.currentRoute.value.meta.requiresNoAuth) {
    router.push({ name: 'home' })
  }
})

// ===================================================
// === BACK BUTTON
// ===================================================

// Whether back button should appear
const shouldHaveBackButton = computed(() => router.currentRoute.value.meta.hasBackButton)
</script>

<template>
  <!-- Notification floating list -->
  <Notifications />

  <!-- Floating user panel -->
  <UserPanel />

  <!-- Floating back button -->
  <BackButton v-if="shouldHaveBackButton" />

  <!-- Page view -->
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
