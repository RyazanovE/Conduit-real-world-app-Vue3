import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import ArticlePreview from '../ui/ArticlePreview.vue'
import { anotherArticle, article } from './constants'
import { api } from '@/app/api/_index'
import { mockLocalStorage, token } from '@/../vitest.setup.ts'
import { RouterLink } from 'vue-router'

mockLocalStorage()

describe('articlePreview Component', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(ArticlePreview, {
      props: { article },
      global: {
        stubs: {
          'router-link': {
            template: '<a data-test="img-profile-link" :href="to"><slot></slot></a>',
            props: ['to'],
          },
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
    vitest.restoreAllMocks()
  })

  const getByTestId = (testId: string) => wrapper.get(`[data-test="${testId}"]`)

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

      await wrapper.setProps({ article: anotherArticle })

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

  describe('button Rendering', () => {
    it('renders button with correct class based on favorited state', () => {
      const button = getByTestId('button-favorite')
      expect(button.classes()).toContain(article.favorited ? 'btn-primary' : 'btn-outline-primary')
    })
  })

  describe('router-links', () => {
    it('have correct :to attribute', () => {
      const imgProfileLink = wrapper.getComponent<typeof RouterLink>('[data-test=\'img-profile-link\']')
      const usernameProfileLink = wrapper.getComponent<typeof RouterLink>('[data-test=\'author-username-link\']')
      const articleProfileLink = wrapper.getComponent<typeof RouterLink>('[data-test=\'article-profile-link\']')

      expect(imgProfileLink.props().to).toEqual({ name: 'profile', params: { username: article.author.username } })
      expect(usernameProfileLink.props().to).toEqual({ name: 'profile', params: { username: article.author.username } })
      expect(articleProfileLink.props().to).toEqual({ name: 'article', params: { slug: article.slug } })
    })
  })

  describe('handling /favorite DELETE Request', () => {
    it('sends correct DELETE request on button click and emits event', async () => {
      vitest.spyOn(api, 'delete').mockResolvedValue({
        data: { ...article, favorited: !article.favorited },
        status: 200,
      })

      await getByTestId('button-favorite').trigger('submit')

      expect(api.delete).toHaveBeenCalledTimes(1)
      expect(api.delete).toHaveBeenCalledWith(`/articles/${article.slug}/favorite`, { headers: { Authorization: `Token ${token}` } })
      expect(wrapper.emitted().favorited).toEqual([[{ slug: article.slug, favorited: !article.favorited }]])
    })

    it('restores favorite state on incorrect DELETE response and emits event', async () => {
      vitest.spyOn(api, 'delete').mockResolvedValue({
        data: null,
        status: 500,
      })

      await getByTestId('button-favorite').trigger('submit')

      expect(api.delete).toHaveBeenCalledTimes(1)
      expect(api.delete).toHaveBeenCalledWith(`/articles/${article.slug}/favorite`, { headers: { Authorization: `Token ${token}` } })
      expect(wrapper.emitted().favorited).toEqual([
        [{ slug: article.slug, favorited: !article.favorited }],
        [{ slug: article.slug, favorited: article.favorited }],
      ])
    })
  })

  describe('handling /favorite POST Request', () => {
    it('sends correct POST request on button click and emits event', async () => {
      await wrapper.setProps({ article: anotherArticle })

      vitest.spyOn(api, 'post').mockResolvedValue({
        data: { ...anotherArticle, favorited: !anotherArticle.favorited },
        status: 200,
      })

      await getByTestId('button-favorite').trigger('submit')

      expect(api.post).toHaveBeenCalledTimes(1)
      expect(api.post).toHaveBeenCalledWith(`/articles/${anotherArticle.slug}/favorite`, undefined, { headers: { Authorization: `Token ${token}` } })
      expect(wrapper.emitted().favorited).toEqual([[{ slug: anotherArticle.slug, favorited: !anotherArticle.favorited }]])
    })

    it('restores favorite state on incorrect POST response and emits event', async () => {
      await wrapper.setProps({ article: anotherArticle })

      vitest.spyOn(api, 'post').mockResolvedValue({
        data: null,
        status: 500,
      })

      await getByTestId('button-favorite').trigger('submit')

      expect(api.post).toHaveBeenCalledTimes(1)
      expect(api.post).toHaveBeenCalledWith(`/articles/${anotherArticle.slug}/favorite`, undefined, { headers: { Authorization: `Token ${token}` } })
      expect(wrapper.emitted().favorited).toEqual([
        [{ slug: anotherArticle.slug, favorited: !anotherArticle.favorited }],
        [{ slug: anotherArticle.slug, favorited: anotherArticle.favorited }],
      ])
    })
  })
})
