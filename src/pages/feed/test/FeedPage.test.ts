import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LocationQueryRaw, RouteRecordRaw, Router } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import FeedPage from '../ui/FeedPage.vue'
import { anotherArticle, article } from '@/shared/test/constants'
import { api } from '@/app/api/_index'
import type { Article } from '@/shared/models'
import { RoutePaths } from '@/app/routes'

let wrapper: VueWrapper<any> | null
let router: Router | null
let mockArticles: Article[]

async function createRealRouter(routes: RouteRecordRaw[], query?: LocationQueryRaw) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  router.push({ path: '/', query })
  await router.isReady()

  return router
}

function createWrapper() {
  return shallowMount(FeedPage, { global: { plugins: router ? [router] : [] } })
}

function getPayloadToCheck(page: number, tag: string) {
  return {
    headers: {},
    params: {
      author: undefined,
      favorited: undefined,
      limit: 20,
      offset: (page - 1) * 20,
      tag,
    },
  }
}

describe('feedPage component', () => {
  beforeEach(() => {
    mockArticles = JSON.parse(JSON.stringify([article, anotherArticle])) as Article[]
  })

  afterEach(() => {
    wrapper = null
    router = null
    mockArticles = []
    vi.restoreAllMocks()
  })

  it('renders list of articles', async () => {
    const tag = 'some-tag'
    const page = 2

    const get = vi.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { articles: mockArticles, articlesCount: mockArticles.length },
    })

    router = await createRealRouter([{ path: RoutePaths.FEED, component: FeedPage }], { page, tag, source: 'my-feed' })
    wrapper = createWrapper()

    expect(get).toHaveBeenCalledOnce()
    expect(get).toHaveBeenCalledWith('/articles/feed', getPayloadToCheck(page, tag))
    await flushPromises()

    const articles = wrapper.findAllComponents({ name: 'ArticlePreview' })
    const pagination = wrapper.findComponent({ name: 'Pagination' })
    const popularTags = wrapper.findComponent({ name: 'PopularTags' })
    expect(articles).toHaveLength(mockArticles.length)
    expect(articles.at(0)?.props('article')).toEqual(mockArticles[0])
    expect(articles.at(1)?.props('article')).toEqual(mockArticles[1])
    expect(pagination.exists()).toBeTruthy()
    expect(pagination.props('pagesAmount')).toBe(mockArticles.length)
    expect(popularTags.exists()).toBeTruthy()
  })

  it('handles articles error response', async () => {
    const tag = 'some-tag'
    const page = 2

    const get = vi.spyOn(api, 'get').mockRejectedValue({
      status: 500,
    })

    router = await createRealRouter([{ path: RoutePaths.FEED, component: FeedPage }], { page, tag, source: 'my-feed' })
    wrapper = createWrapper()

    expect(get).toHaveBeenCalledOnce()
    expect(get).toHaveBeenCalledWith('/articles/feed', getPayloadToCheck(page, tag))
    await flushPromises()

    const articles = wrapper.findAllComponents({ name: 'ArticlePreview' })
    const pagination = wrapper.findComponent({ name: 'Pagination' })
    const popularTags = wrapper.findComponent({ name: 'PopularTags' })
    expect(articles).toHaveLength(0)
    expect(pagination.exists()).toBeTruthy()
    expect(pagination.props('pagesAmount')).toBeUndefined()
    expect(popularTags.exists()).toBeTruthy()
  })

  it('calls updateArticles when route query parameters change', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { articles: mockArticles, articlesCount: mockArticles.length },
    })
    let page = 1
    let tag = 'tag'
    let source: string | undefined

    async function updateRoute(calledTimes: number, page: number, tag: string, source?: string) {
      if (router) {
        router.push({ path: RoutePaths.FEED, query: { page, tag, source } })
        await router.isReady()
        await flushPromises()
        expect(get).toHaveBeenCalledTimes(calledTimes)
        expect(get).toHaveBeenCalledWith('/articles', getPayloadToCheck(page, tag))
      }
    }

    router = await createRealRouter([{ path: RoutePaths.FEED, component: FeedPage }], { page, tag })
    createWrapper()

    await flushPromises()
    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith('/articles', getPayloadToCheck(page, tag))

    page = 4
    await updateRoute(2, 4, tag, source)

    tag = 'another-tag'
    await updateRoute(3, 4, tag, source)

    source = 'my-feed'
    await updateRoute(4, 4, tag, source)
  })

  it('toggleFavorite updates the article correctly', async () => {
    const favoritesCount = mockArticles[0].favoritesCount
    const anotherFavoritesCount = mockArticles[1].favoritesCount

    vi.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { articles: mockArticles, articlesCount: mockArticles.length },
    })

    router = await createRealRouter([{ path: RoutePaths.FEED, component: FeedPage }], {})
    wrapper = createWrapper()

    await flushPromises()
    const { toggleFavorite } = wrapper.vm

    toggleFavorite({ slug: mockArticles[0].slug, favorited: false })
    toggleFavorite({ slug: mockArticles[1].slug, favorited: true })

    const updatedArticles = wrapper.findAllComponents({ name: 'ArticlePreview' })
    expect(updatedArticles.at(0)?.props('article').favorited).toBe(false)
    expect(updatedArticles.at(0)?.props('article').favoritesCount).toBe(favoritesCount - 1)
    expect(updatedArticles.at(1)?.props('article').favorited).toBe(true)
    expect(updatedArticles.at(1)?.props('article').favoritesCount).toBe(anotherFavoritesCount + 1)
  })
})
