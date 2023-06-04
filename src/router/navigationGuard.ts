import { auth } from '@/api/firebase'
import type { NavigationGuardWithThis } from 'vue-router'

export const navigationGuard: NavigationGuardWithThis<undefined> = (to, from) => {
  if (to.meta.requiresAuth && auth.currentUser == null) {
    return { name: 'login' }
  }
}
