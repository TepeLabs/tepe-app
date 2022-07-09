import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: '/', name: 'Collection', component: ()=>import('@/views/ViewCollection.vue')},
  {path: '/wallet', name: 'Wallet', component: ()=>import('@/views/ViewWallet.vue')},
  {path: '/channel', name: 'Channel', component: ()=>import('@/views/ViewChannel.vue')},
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router