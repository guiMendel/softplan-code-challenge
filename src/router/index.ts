import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import User from '../views/User.vue'
import PapersIndex from '../views/PapersIndex.vue'
import Paper from '@/views/Paper.vue'
import Search from '../views/Search.vue'
import { navigationGuard } from './navigationGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      meta: { requiresAuth: true },

      children: [
        {
          path: '',
          name: 'home',
          component: PapersIndex
        },
        {
          path: 'search',
          name: 'search',
          component: Search
        }
      ]
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
      meta: { requiresAuth: true, hasBackButton: true, noUserPanel: true }
    },
    {
      path: '/paper/:paperId',
      name: 'paper',
      component: Paper,
      props: true,
      meta: { requiresAuth: true, hasBackButton: true, noUserPanel: true }
    }
  ]
})

router.beforeEach(navigationGuard)

export default router
