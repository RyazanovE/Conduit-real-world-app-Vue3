import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LocationQueryRaw, RouteParamsRaw, RouteRecordRaw, Router } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import type { AxiosRequestConfig } from 'axios'
import Profile from '../ui/Profile.vue'
import { anotherArticle, article, mockProfileData } from '@/shared/test/constants'
import { api } from '@/app/api/_index'
import type { Article } from '@/shared/models'
import { authFetchOptions, clearLocalStorage, mockLocalStorage, user } from '@/../vitest.setup'
import { RouteNames, RoutePaths } from '@/app/routes'

let wrapper: VueWrapper<any> | null
let router: Router | null
let mockArticles: Article[]

async function createRealRouter(routes: RouteRecordRaw[], query?: LocationQueryRaw, params?: RouteParamsRaw) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  router.push({ name: 'profile', query, params })
  await router.isReady()

  return router
}

function createWrapper() {
  return shallowMount(Profile, { global: { plugins: router ? [router] : [] } })
}

describe('profile component', () => {
  beforeEach(() => {
    mockLocalStorage()
    mockArticles = JSON.parse(JSON.stringify([article, anotherArticle])) as Article[]
  })

  afterEach(() => {
    wrapper = null
    router = null
    mockArticles = []
    clearLocalStorage()
    vi.restoreAllMocks()
  })

  it('renders list of articles, renders props with successfull response', async () => {
    const get = vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      const data = url.includes('articles')
        ? { articles: mockArticles, articlesCount: mockArticles.length }
        : { profile: mockProfileData }

      return { status: 200, data }
    })

    router = await createRealRouter([{ name: RouteNames.PROFILE, path: '/profile/:username', component: Profile }], undefined, { username: user.username })
    wrapper = createWrapper()
    await flushPromises()

    expect(get).toHaveBeenCalledTimes(2)
    expect(get).toHaveBeenNthCalledWith(1, `/profiles/${user.username}`, authFetchOptions)
    const paramsToCheck = {
      author: mockProfileData.username,
      favorited: undefined,
      limit: 20,
      offset: 0,
      tag: undefined,
    }
    expect(get).toHaveBeenNthCalledWith(2, '/articles', { ...authFetchOptions, params: paramsToCheck })

    const articles = wrapper.findAllComponents({ name: 'ArticlePreview' })
    const pagination = wrapper.findComponent({ name: 'Pagination' })
    const userInfo = wrapper.findComponent({ name: 'UserInfo' })
    expect(articles).toHaveLength(mockArticles.length)
    expect(articles.at(0)?.props('article')).toEqual(mockArticles[0])
    expect(articles.at(1)?.props('article')).toEqual(mockArticles[1])
    expect(pagination.exists()).toBeTruthy()
    expect(pagination.props('pagesAmount')).toBe(mockArticles.length)
    expect(userInfo.exists()).toBeTruthy()
    expect(userInfo.props('user')).toEqual(mockProfileData)
  })
  it('renders empty list of articles with rejected response', async () => {
    const get = vi.spyOn(api, 'get').mockRejectedValue({ status: 500 })

    router = await createRealRouter([{ name: RouteNames.PROFILE, path: RoutePaths.PROFILE, component: Profile }], undefined, { username: user.username })
    wrapper = createWrapper()
    await flushPromises()
    const paramsToCheck = {
      author: undefined,
      favorited: undefined,
      limit: 20,
      offset: 0,
      tag: undefined,
    }

    expect(get).toHaveBeenCalledTimes(2)
    expect(get).toHaveBeenNthCalledWith(1, `/profiles/${user.username}`, authFetchOptions)
    expect(get).toHaveBeenNthCalledWith(2, '/articles', { ...authFetchOptions, params: paramsToCheck })

    expect(wrapper.findAllComponents({ name: 'ArticlePreview' })).toHaveLength(0)
    expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBeFalsy()
    expect(wrapper.findComponent({ name: 'UserInfo' }).exists()).toBeFalsy()
  })
  it('fetches articles on route params change', async () => {
    const articlesFetch = vi.fn()
    vi.spyOn(api, 'get').mockImplementation(async (url: string, config: AxiosRequestConfig<any> | undefined) => {
      const isArticles = url.includes('articles')

      const data = isArticles
        ? { articles: mockArticles, articlesCount: mockArticles.length }
        : { profile: mockProfileData }

      if (isArticles) {
        articlesFetch(url, config?.params)
      }

      return { status: 200, data }
    })

    router = await createRealRouter([{ name: RouteNames.PROFILE, path: RoutePaths.PROFILE, component: Profile }], undefined, { username: user.username })
    wrapper = createWrapper()
    await flushPromises()

    const paramsToCheck = {
      author: mockProfileData.username,
      favorited: undefined,
      limit: 20,
      offset: 0,
      tag: undefined,
    }
    expect(articlesFetch).toHaveBeenCalledTimes(1)
    expect(articlesFetch).toHaveBeenNthCalledWith(1, `/articles`, paramsToCheck)

    router.push({ name: RouteNames.PROFILE, params: { username: paramsToCheck.author } })
    await router.isReady()
    await flushPromises()
    expect(articlesFetch).toHaveBeenCalledTimes(2)
    expect(articlesFetch).toHaveBeenNthCalledWith(2, `/articles`, paramsToCheck)

    paramsToCheck.offset = 20
    router.push({ name: RouteNames.PROFILE, params: { username: paramsToCheck.author }, query: { page: 2 } })
    await router.isReady()
    await flushPromises()
    expect(articlesFetch).toHaveBeenCalledTimes(3)
    expect(articlesFetch).toHaveBeenNthCalledWith(3, `/articles`, paramsToCheck)
  })
  it('onAuthorFollowed, toggleFavorite methods', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      const isArticles = url.includes('articles')

      const data = isArticles
        ? { articles: JSON.parse(JSON.stringify(mockArticles)), articlesCount: mockArticles.length }
        : { profile: JSON.parse(JSON.stringify(mockProfileData)) }

      return { status: 200, data }
    })

    router = await createRealRouter([{ name: RouteNames.PROFILE, path: RoutePaths.PROFILE, component: Profile }], undefined, { username: user.username })
    wrapper = createWrapper()
    await flushPromises()
    const { onAuthorFollowed, onFavorited } = wrapper.vm
    const userInfo = wrapper.findComponent({ name: 'UserInfo' })
    const articlePreview = wrapper.findAllComponents({ name: 'ArticlePreview' })

    expect(userInfo.exists()).toBeTruthy()
    expect(userInfo.props('user')).toEqual(mockProfileData)
    expect(articlePreview.length).toBe(2)
    expect(articlePreview[0]!.props('article')).toEqual(mockArticles[0])
    expect(articlePreview[1]!.props('article')).toEqual(mockArticles[1])

    onFavorited({ slug: mockArticles[1].slug, favorited: !mockArticles[1].favorited })
    onAuthorFollowed(true)
    await nextTick()

    expect(userInfo.exists()).toBeTruthy()
    expect(userInfo.props('user')).toEqual({ ...mockProfileData, following: !mockProfileData.following })
    expect(articlePreview.length).toBe(2)
    expect(articlePreview[0]!.props('article')).toEqual(mockArticles[0])
    expect(articlePreview[1]!.props('article')).toEqual({
      ...mockArticles[1],
      favorited: !mockArticles[1].favorited,
      favoritesCount: mockArticles[1].favoritesCount + 1,
    })
  })
})
