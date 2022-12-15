import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: ()=>import('@/views/login.vue')
    },
    {
      path:'/music',
      name:'music',
      component:()=>import('@/views/music.vue')
    }
  ]
})

export default router
