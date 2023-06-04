import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Notification } from '@/types/Notification.interface'

export const useNotificationsStore = defineStore('notifications', () => {
  // Id generator
  const idGenerator = ref(0)

  // Notification array
  const notifications = ref<{ [key: number]: Notification }>({})

  // Create new notification
  const notify = (type: Notification['type'], message: Notification['message']) => {
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

    return notification
  }

  // Erase a notification
  const erase = (id: Notification['id']) => delete notifications.value[id]

  return { notifications, notify, erase }
})
