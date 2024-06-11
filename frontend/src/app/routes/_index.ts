import { createRouter, createWebHistory } from 'vue-router'
import { FeedPage } from '@/pages/feed'


const routes = [
  { path: '/', component: FeedPage, name: 'feed' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router