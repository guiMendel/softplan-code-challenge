import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Notification } from '@/types/Notification.interface'

export const useNotificationsStore = defineStore('notifications', () => {
  // ===================
  // === NOTIFICATIONS
  // ===================

  // Id generator
  const idGenerator = ref(0)

  // Notification array
  const notifications = ref<{ [key: number]: Notification }>({})

  // Create new notification
  const notify = (type: Notification['type'], message: Notification['message']) => {
    console.log(notifications.value)

    const id = idGenerator.value++

    const notification = {
      type,
      message,
      timestamp: new Date(),
      id
    }

    notifications.value = {
      ...notifications.value,
      [id]: notification
    }

    // Erase after timeout
    setTimeout(() => erase(id), timeout.value)

    return notification
  }

  // Erase a notification
  const erase = (id: Notification['id']) => delete notifications.value[id]

  // ===================
  // === TIME OUT
  // ===================

  // How long a notification stays alive for
  const timeout = ref(5000)

  const alterTimeout = (newTimeout: number) => (timeout.value = newTimeout)

  return { notifications, notify, erase, timeout, alterTimeout }
})
