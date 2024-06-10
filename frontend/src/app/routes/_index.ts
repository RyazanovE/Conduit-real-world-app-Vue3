import { createMemoryHistory, createRouter } from 'vue-router'
import { FeedPage } from '@/pages/feed'


const routes = [
  { path: '/', component: FeedPage, name: 'feed' },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router