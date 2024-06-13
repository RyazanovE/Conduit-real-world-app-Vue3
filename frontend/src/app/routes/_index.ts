import { createRouter, createWebHistory } from 'vue-router'
import { LoginPage, RegisterPage } from './sign-in';
import { FeedPage } from './feed';


const routes = [
  { path: '/', component: FeedPage, name: 'feed' },
  { path: '/register', component: RegisterPage, name: 'register' },
  { path: '/login', component: LoginPage, name: 'login' },
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