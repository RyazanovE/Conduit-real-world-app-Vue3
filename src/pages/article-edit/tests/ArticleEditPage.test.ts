import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import { useRoute } from 'vue-router'
import ArticleEditPage from '../ui/ArticleEditPage.vue'
import TagsInput from '../ui/TagsInput.vue'
import { authFetchOptions, clearLocalStorage, mockLocalStorage } from '@/../vitest.setup.ts'
import { api } from '@/app/api/_index'
import { anotherArticle, article } from '@/features/article-preview/tests/constants'

const push = vitest.fn()

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object
  return {
    ...actual,
    useRoute: vitest.fn(() => ({
      params: {
        slug: article.slug,
      },
    })),
    useRouter: vitest.fn(() => ({
      push,
    })),
  }
})

describe('articleEditPage Component', () => {
  let wrapper: VueWrapper<any> | null

  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    vitest.restoreAllMocks()
    clearLocalStorage()
  })

  function createWrapper() {
    return mount(ArticleEditPage, {
      shallow: true,
      global: {
        stubs: {
          TagsInput: {
            template: '<div></div>',
            props: ['tags'],
          },
        },
      },
    })
  }

  const getByTestId = (testId: string) => wrapper?.get(`[data-test="${testId}"]`)

  describe('fetch article requests', () => {
    it('correctrly presets and updates form', async () => {
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { article },
        status: 200,
      })
      wrapper = createWrapper()

      expect(api.get).toHaveBeenCalledOnce()
      expect(api.get).toHaveBeenCalledWith(`/articles/${article.slug}`, authFetchOptions)
      await flushPromises()

      expect((getByTestId('article-title-input')?.element as HTMLInputElement).value).toBe(article.title)
      expect((getByTestId('article-description-input')?.element as HTMLInputElement).value).toBe(article.description)
      expect((getByTestId('article-body-textarea')?.element as HTMLTextAreaElement).value).toBe(article.body)
      expect(wrapper.getComponent(TagsInput).props('tags')).toEqual(article.tagList)
    })
    it('correctly handles error in response', async () => {
      vitest.spyOn(api, 'get').mockRejectedValue({
        data: null,
        status: 500,
      })
      wrapper = createWrapper()

      expect(api.get).toHaveBeenCalledOnce()
      expect(api.get).toHaveBeenCalledWith(`/articles/${article.slug}`, authFetchOptions)
      await flushPromises()

      expect((getByTestId('article-title-input')?.element as HTMLInputElement).value).toBe('')
      expect((getByTestId('article-description-input')?.element as HTMLInputElement).value).toBe('')
      expect((getByTestId('article-body-textarea')?.element as HTMLTextAreaElement).value).toBe('')
      expect(wrapper.getComponent(TagsInput).props('tags').length).toBe(0)
    })
  })

  describe('form submit', () => {
    it('correctly submits edit article', async () => {
      const valuesToUpdate = { title: anotherArticle.title, description: anotherArticle.description, body: anotherArticle.body, tagList: anotherArticle.tagList }
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { article },
        status: 200,
      })
      vitest.spyOn(api, 'put').mockResolvedValue({
        data: { article: { ...article, valuesToUpdate } },
        status: 200,
      })
      wrapper = createWrapper()
      await flushPromises()

      getByTestId('article-title-input')?.setValue(valuesToUpdate.title)
      getByTestId('article-description-input')?.setValue(valuesToUpdate.description)
      getByTestId('article-body-textarea')?.setValue(valuesToUpdate.body)
      const { form } = wrapper.vm
      form.tagList = valuesToUpdate.tagList
      await flushPromises()

      getByTestId('publish-button')?.trigger('submit')
      await flushPromises()

      expect(api.put).toHaveBeenCalledOnce()
      expect(api.put).toHaveBeenCalledWith(`/articles/${article.slug}`, { article: valuesToUpdate }, authFetchOptions)
      expect(push).toHaveBeenCalledOnce()
      expect(push).toHaveBeenCalledWith({ name: 'article', params: { slug: article.slug } })
    })

    it('correctly submits create article', async () => {
      // @ts-expect-error mockImplementationOnce not in type
      useRoute.mockImplementationOnce(() => ({
        params: {
          slug: undefined,
        },
      }))
      const valuesToCreate = { title: anotherArticle.title, description: anotherArticle.description, body: anotherArticle.body, tagList: anotherArticle.tagList }
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { article },
        status: 200,
      })
      vitest.spyOn(api, 'post').mockResolvedValue({
        data: { article: { ...article, valuesToCreate } },
        status: 200,
      })
      wrapper = createWrapper()
      await flushPromises()

      getByTestId('article-title-input')?.setValue(valuesToCreate.title)
      getByTestId('article-description-input')?.setValue(valuesToCreate.description)
      getByTestId('article-body-textarea')?.setValue(valuesToCreate.body)
      const { form } = wrapper.vm
      form.tagList = valuesToCreate.tagList
      await flushPromises()

      getByTestId('publish-button')?.trigger('submit')
      await flushPromises()

      expect(api.post).toHaveBeenCalledOnce()
      expect(api.post).toHaveBeenCalledWith(`/articles`, { article: valuesToCreate }, authFetchOptions)
      expect(push).toHaveBeenCalledOnce()
      expect(push).toHaveBeenCalledWith({ name: 'article', params: { slug: article.slug } })
    })

    it('renders errors correctly', async () => {
      const valuesToUpdate = { title: anotherArticle.title, description: anotherArticle.description, body: anotherArticle.body, tagList: anotherArticle.tagList }
      vitest.spyOn(console, 'error').mockImplementation(() => { })
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: null,
        status: 500,
      })
      vitest.spyOn(api, 'put').mockResolvedValue({
        data: { article: { ...article, valuesToUpdate } },
        status: 200,
      })
      wrapper = createWrapper()
      await flushPromises()

      getByTestId('publish-button')?.trigger('submit')
      await flushPromises()

      expect(api.put).not.toHaveBeenCalled()
      expect(push).not.toHaveBeenCalled()
      expect(wrapper.vm.formErrors.length).toBe(3)

      getByTestId('article-title-input')?.setValue(valuesToUpdate.title)
      await flushPromises()
      getByTestId('publish-button')?.trigger('submit')
      await flushPromises()

      expect(api.put).not.toHaveBeenCalled()
      expect(push).not.toHaveBeenCalled()
      expect(wrapper.vm.formErrors.length).toBe(2)
    })
  })
})
