<template>
  <div id="notifications">
    <span
      class="notification"
      v-for="notification in notifications"
      :key="notification.timestamp"
      >{{ notification.message }}</span
    >
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '../types/Notification.interface'

const props = defineProps<{ notifications: Notification[] }>()
</script>
