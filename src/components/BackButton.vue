<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <font-awesome-icon id="back-button" :icon="['fas', 'backward']" @click="router.back()" />
</template>

<style scoped lang="scss">
#back-button {
  position: fixed;

  top: 1rem;
  left: 1rem;

  font-size: 1.5rem;

  cursor: pointer;

  transition: all 100ms;

  &:hover {
    filter: brightness(0.8);
  }
}
</style>
