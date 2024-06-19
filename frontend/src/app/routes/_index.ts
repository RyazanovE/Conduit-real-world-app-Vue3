import { createRouter, createWebHistory } from 'vue-router'
import { LoginPage, RegisterPage } from './sign-in';
import { FeedPage } from './feed';
import { ArticleReadPage } from '@/pages/article-read';
import { ArticleEditPage } from '@/pages/article-edit';


const routes = [
  { path: '/', component: FeedPage, name: 'feed' },
  { path: '/register', component: RegisterPage, name: 'register' },
  { path: '/login', component: LoginPage, name: 'login' },
  { path: '/article/:slug', component: ArticleReadPage, name: 'article' },
  { path: '/editor', component: ArticleReadPage, name: 'editor-new' },
  { path: '/editor/:slug?', component: ArticleEditPage, name: 'editor' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
})

export default router