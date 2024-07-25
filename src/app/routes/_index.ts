import { createRouter, createWebHistory } from 'vue-router'
import { RouteNames, RoutePaths } from './route-enums'
import { ArticleReadPage } from '@/pages/article-read'
import { ArticleEditPage } from '@/pages/article-edit'
import { Settings } from '@/pages/settings'
import { FeedPage } from '@/pages/feed'
import { LoginPage, RegisterPage } from '@/pages/sign-in'
import { Profile } from '@/pages/profile'
import { getUser } from '@/shared/utils'

export const routes = [
  { path: RoutePaths.FEED, component: FeedPage, name: RouteNames.FEED },
  { path: RoutePaths.REGISTER, component: RegisterPage, name: RouteNames.REGISTER },
  { path: RoutePaths.LOGIN, component: LoginPage, name: RouteNames.LOGIN },
  { path: RoutePaths.ARTICLE, component: ArticleReadPage, name: RouteNames.ARTICLE },
  { path: RoutePaths.EDITOR_NEW, component: ArticleReadPage, name: RouteNames.EDITOR_NEW, meta: { requiresAuth: true } },
  { path: RoutePaths.EDITOR, component: ArticleEditPage, name: RouteNames.EDITOR, meta: { requiresAuth: true } },
  { path: RoutePaths.SETTINGS, component: Settings, name: RouteNames.SETTINGS, meta: { requiresAuth: true } },
  { path: RoutePaths.PROFILE, component: Profile, name: RouteNames.PROFILE },
  { path: RoutePaths.PROFILE_FAVORITES, component: Profile, name: RouteNames.PROFILE_FAVORITES },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.beforeEach((to) => {
  const user = getUser()
  const isAuthRequired = to.matched.some(record => record.meta.requiresAuth)
  const isLoginRedirect = isAuthRequired && !user && to.name !== RouteNames.LOGIN

  if (isLoginRedirect) {
    return { name: RouteNames.LOGIN }
  }
})

export default router
