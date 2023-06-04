<template>
  <div id="notifications">
    <span
      class="notification"
      :class="notification.type"
      v-for="notification in notifications"
      :key="notification.timestamp.toJSON()"
      >{{ notification.message }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationsStore()
const { erase } = notificationStore
const { notifications } = storeToRefs(notificationStore)
</script>
