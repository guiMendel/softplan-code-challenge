import type { NavigationGuardWithThis } from 'vue-router'

export const navigationGuard: NavigationGuardWithThis<undefined> = (to, from) => {
  if (to.meta.requiresAuth) {
    return { name: 'login' }
  }
}
