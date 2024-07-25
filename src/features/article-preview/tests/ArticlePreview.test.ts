import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import type { RouterLink } from 'vue-router'
import ArticlePreview from '../ui/ArticlePreview.vue'
import { anotherArticle, article } from '../../../shared/test/constants'
import { api } from '@/app/api'
import { authFetchOptions, clearLocalStorage, mockLocalStorage } from '@/../vitest.setup.ts'
import { RouteNames } from '@/app/routes'
import { routerLinkStub } from '@/shared/test'

let wrapper: VueWrapper<any> | null

function createWrapper() {
  return shallowMount(ArticlePreview, {
    props: { article: JSON.parse(JSON.stringify(article)) },
    global: {
      stubs: {
        ...routerLinkStub,
      },
    },
  })
}

const getByTestId = (testId: string) => (wrapper as VueWrapper<any>).get(`[data-test="${testId}"]`)

describe('articlePreview Component', () => {
  beforeEach(() => {
    wrapper = createWrapper()
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    vitest.restoreAllMocks()
    clearLocalStorage()
  })

  it('renders button with correct class based on favorited state', () => {
    expect(getByTestId('button-favorite')?.classes()).toContain(article.favorited ? 'btn-primary' : 'btn-outline-primary')
  })

  it('router-links have correct :to attribute', () => {
    const imgProfileLink = wrapper!.getComponent<typeof RouterLink>('[data-test=\'img-profile-link\']')
    const usernameProfileLink = wrapper!.getComponent<typeof RouterLink>('[data-test=\'author-username-link\']')
    const articleProfileLink = wrapper!.getComponent<typeof RouterLink>('[data-test=\'article-profile-link\']')

    expect(imgProfileLink.props().to).toEqual({ name: RouteNames.PROFILE, params: { username: article.author.username } })
    expect(usernameProfileLink.props().to).toEqual({ name: RouteNames.PROFILE, params: { username: article.author.username } })
    expect(articleProfileLink.props().to).toEqual({ name: RouteNames.ARTICLE, params: { slug: article.slug } })
  })

  describe('article props rendering', () => {
    it('correctly updates props interpolation', async () => {
      expect(getByTestId('article-date').text()).toEqual(new Date(article.createdAt).toLocaleDateString(undefined, {
        dateStyle: 'long',
      }))
      expect(getByTestId('author-image').attributes().src).toEqual(article.author.image)
      expect(getByTestId('author-username-link').text()).toEqual(article.author.username)
      expect(getByTestId('article-title').text()).toEqual(article.title)
      expect(getByTestId('article-description').text()).toEqual(article.description)
      expect(getByTestId('tag-list').findAll('li').map(tag => tag.text())).toEqual(article.tagList)
      expect(getByTestId('button-favorite').text()).toEqual(article.favoritesCount.toString())

      await wrapper!.setProps({ article: JSON.parse(JSON.stringify(anotherArticle)) })

      expect(getByTestId('article-date').text()).toEqual(new Date(anotherArticle.createdAt).toLocaleDateString(undefined, {
        dateStyle: 'long',
      }))
      expect(getByTestId('author-image').attributes().src).toEqual(anotherArticle.author.image)
      expect(getByTestId('author-username-link').text()).toEqual(anotherArticle.author.username)
      expect(getByTestId('article-title').text()).toEqual(anotherArticle.title)
      expect(getByTestId('article-description').text()).toEqual(anotherArticle.description)
      expect(getByTestId('tag-list').findAll('li').map(tag => tag.text())).toEqual(anotherArticle.tagList)
      expect(getByTestId('button-favorite').text()).toEqual(anotherArticle.favoritesCount.toString())
    })
  })

  describe('handling /favorite DELETE Request', () => {
    it('sends correct DELETE request on button click and emits event', async () => {
      const deleteMethod = vitest.spyOn(api, 'delete').mockResolvedValue({
        data: { ...JSON.parse(JSON.stringify(article)), favorited: !article.favorited },
        status: 200,
      })

      await getByTestId('button-favorite').trigger('submit')

      expect(deleteMethod).toHaveBeenCalledTimes(1)
      expect(deleteMethod).toHaveBeenCalledWith(`/articles/${article.slug}/favorite`, authFetchOptions)
      expect(wrapper!.emitted().favorited).toEqual([[{ slug: article.slug, favorited: !article.favorited }]])
    })

    it('restores favorite state on incorrect DELETE response and emits event', async () => {
      vitest.spyOn(console, 'error').mockImplementation(() => { })
      const deleteMethod = vitest.spyOn(api, 'delete').mockRejectedValue({
        data: null,
        status: 500,
      })

      await getByTestId('button-favorite').trigger('submit')

      expect(deleteMethod).toHaveBeenCalledTimes(1)
      expect(deleteMethod).toHaveBeenCalledWith(`/articles/${article.slug}/favorite`, authFetchOptions)
      expect(wrapper!.emitted().favorited).toEqual([
        [{ slug: article.slug, favorited: !article.favorited }],
        [{ slug: article.slug, favorited: article.favorited }],
      ])
    })
  })

  describe('handling /favorite POST Request', () => {
    it('sends correct POST request on button click and emits event', async () => {
      const post = vitest.spyOn(api, 'post').mockResolvedValue({
        data: { ...JSON.parse(JSON.stringify(anotherArticle)), favorited: !anotherArticle.favorited },
        status: 200,
      })

      await wrapper!.setProps({ article: JSON.parse(JSON.stringify(anotherArticle)) })
      await getByTestId('button-favorite').trigger('submit')

      expect(post).toHaveBeenCalledTimes(1)
      expect(post).toHaveBeenCalledWith(`/articles/${anotherArticle.slug}/favorite`, undefined, authFetchOptions)
      expect(wrapper!.emitted().favorited).toEqual([[{ slug: anotherArticle.slug, favorited: !anotherArticle.favorited }]])
    })

    it('restores favorite state on incorrect POST response and emits event', async () => {
      vitest.spyOn(console, 'error').mockImplementation(() => { })
      await wrapper?.setProps({ article: JSON.parse(JSON.stringify(anotherArticle)) })

      const post = vitest.spyOn(api, 'post').mockRejectedValue({
        data: null,
        status: 500,
      })

      await getByTestId('button-favorite').trigger('submit')

      expect(post).toHaveBeenCalledTimes(1)
      expect(post).toHaveBeenCalledWith(`/articles/${anotherArticle.slug}/favorite`, undefined, authFetchOptions)
      expect(wrapper!.emitted().favorited).toEqual([
        [{ slug: anotherArticle.slug, favorited: !anotherArticle.favorited }],
        [{ slug: anotherArticle.slug, favorited: anotherArticle.favorited }],
      ])
    })
  })
})
