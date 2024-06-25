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
  { path: '/editor', component: ArticleReadPage, name: 'editor-new' },
  { path: '/editor/:slug?', component: ArticleEditPage, name: 'editor' },
  { path: '/settings', component: Settings, name: 'settings' },
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

export default router
