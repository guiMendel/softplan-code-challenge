<script setup lang="ts">
import { useRouter } from 'vue-router'

// Access router
const router = useRouter()

const triggerNavigation = () => {
  if (router.currentRoute.value.name == 'search') router.push({ name: 'home' })
  else router.push({ name: 'search' })
}
</script>

<template>
  <main>
    <!-- Home navigation button -->
    <div class="navigation-button" @click="triggerNavigation">
      <font-awesome-icon
        :icon="['fas', router.currentRoute.value.name == 'search' ? 'folder' : 'magnifying-glass']"
      />
      <span>{{ router.currentRoute.value.name == 'search' ? 'see papers' : 'start search' }}</span>
    </div>

    <!-- Show page content -->
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

main {
  width: 100%;
  min-height: 100vh;

  padding-top: 3rem;

  position: relative;

  flex-direction: column;

  .navigation-button {
    margin-left: 2rem;

    @include light-button;
  }
}
</style>
