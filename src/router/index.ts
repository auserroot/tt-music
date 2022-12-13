import { createRouter, createWebHistory } from 'vue-router'
import Music from '../views/music.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Music
    }
  ]
})

export default router
