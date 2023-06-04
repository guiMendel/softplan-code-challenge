<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'
import type { Notification } from '@/types/Notification.interface'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, ref } from 'vue'

const notificationStore = useNotificationsStore()
const { notifications, timeout } = storeToRefs(notificationStore)
const { erase } = notificationStore

// ===============
// === COUNTDOWN
// ===============

// How frequently to update countdown display
const countdownTickDuration = 20

// Holds current time
const currentTime = ref(new Date())

// Update time
const countdown = setInterval(() => (currentTime.value = new Date()), countdownTickDuration)

// Get elapsed lifetime of a notification
const getLifetime = (notification: Notification) => {
  return Math.max(
    1 - (currentTime.value.getTime() - notification.timestamp.getTime()) / timeout.value,
    0
  )
}

onBeforeUnmount(() => clearInterval(countdown))
</script>

<template>
  <div id="notifications">
    <span
      class="notification"
      :class="notification.type"
      v-for="notification in notifications"
      :key="notification.timestamp.toJSON()"
      @click="erase(notification.id)"
      >{{ notification.message }}

      <span class="countdown" :style="{ width: `${getLifetime(notification) * 100}%` }"></span>
    </span>
  </div>
</template>

<style lang="scss">
@import '../style/variables.scss';

#notifications {
  position: fixed;
  left: 50%;
  top: 2rem;

  translate: -50% 0;

  flex-direction: column-reverse;
  align-items: center;
  gap: 0.5rem;

  z-index: 20;

  .notification {
    border-radius: $border-radius;

    padding: 0.5rem 0.7rem;
    font-weight: 700;

    box-shadow: 0 1px 4px 1px rgb(33, 33, 33, 0.2);

    animation: enter 200ms ease-out;

    position: relative;

    overflow: hidden;

    cursor: pointer;

    &.error {
      background-color: $bad;
      color: $light;
    }

    &.success {
      background-color: $good;
      color: $strong;
    }

    .countdown {
      position: absolute;
      bottom: 0;
      left: 0;

      height: 0.3rem;
      background-color: $strong;
    }
  }

  @keyframes enter {
    from {
      opacity: 0;

      translate: 0 -2rem;

      margin-bottom: -2rem;
    }

    to {
      opacity: 1;

      translate: 0 0;

      margin-bottom: 0;
    }
  }
}
</style>
