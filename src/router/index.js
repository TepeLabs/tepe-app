import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: '/', name: 'Collection', component: ()=>import('@/views/TheCollection.vue')},
  // {path: '/wallet', name: 'Wallet', component: ()=>import('@/views/Wallet.vue')},
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router