<script setup lang="ts">
import type { User } from '@/types/User.interface'
import { computed } from 'vue'

const props = defineProps<{ user: User }>()

// Get initials from name
const initials = computed(() =>
  props.user.name
    .split(' ')
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
)
</script>

<template>
  <div class="portrait">
    <span class="initials">{{ initials }}</span>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.portrait {
  width: 2.5em;

  background-color: $strong;

  border-radius: 50%;

  align-items: center;
  justify-content: center;

  .initials {
    font-family: Pacifico, monospace;
  }

  aspect-ratio: 1/1;
}
</style>
