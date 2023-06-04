// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationsStore } from '../notifications'

describe('Notification Store', () => {
  beforeEach(() => {
    // creates a store for the test
    setActivePinia(createPinia())
  })

  it('adds new notifications', () => {
    const notificationStore = useNotificationsStore()

    const { id } = notificationStore.notify('error', 'test notification')

    expect(notificationStore.notifications[id]).toBeTruthy()
  })

  it('can erase a notification', () => {
    const notificationStore = useNotificationsStore()

    const { id } = notificationStore.notify('error', 'test notification')

    notificationStore.erase(id)

    expect(Object.keys(notificationStore.notifications)).toHaveLength(0)
  })

  it('erases notifications after timeout', async () => {
    const notificationStore = useNotificationsStore()

    const newTimeout = 10

    notificationStore.setTimeout(newTimeout)

    notificationStore.notify('error', 'test notification')

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(notificationStore.notifications)

        expect(Object.keys(notificationStore.notifications)).toHaveLength(0)

        resolve()
      }, newTimeout)
    })
  })
})
