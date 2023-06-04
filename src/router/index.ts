import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import User from '../views/User.vue'
import { navigationGuard } from './navigationGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresNoAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { requiresNoAuth: true }
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: User,
      props: true,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(navigationGuard)

export default router
