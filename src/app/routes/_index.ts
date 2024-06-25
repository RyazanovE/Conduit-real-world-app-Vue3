import { createRouter, createWebHistory } from 'vue-router'
import { ArticleReadPage } from '@/pages/article-read'
import { ArticleEditPage } from '@/pages/article-edit'
import { Settings } from '@/pages/settings'
import { FeedPage } from '@/pages/feed'
import { LoginPage, RegisterPage } from '@/pages/sign-in'
import { Profile } from '@/pages/profile'

export const routes = [
  { path: '/', component: FeedPage, name: 'feed' },
  { path: '/register', component: RegisterPage, name: 'register' },
  { path: '/login', component: LoginPage, name: 'login' },
  { path: '/article/:slug', component: ArticleReadPage, name: 'article' },
  { path: '/editor', component: ArticleReadPage, name: 'editor-new', meta: { requiresAuth: true } },
  { path: '/editor/:slug?', component: ArticleEditPage, name: 'editor', meta: { requiresAuth: true } },
  { path: '/settings', component: Settings, name: 'settings', meta: { requiresAuth: true } },
  { path: '/profile/:username', component: Profile, name: 'profile' },
  { path: '/profile/:username/favorites', component: Profile, name: 'profile-favorites' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to) => {
  const user = localStorage.getItem('user')
  const isAuthRequired = to.matched.some(record => record.meta.requiresAuth)

  if (isAuthRequired && !user && to.name !== 'Login') {
    return { name: 'login' }
  }
})

export default router
