import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import ArticleEditPage from '../ui/ArticleEditPage.vue'
import TagsInput from '../ui/TagsInput.vue'
import { authFetchOptions, clearLocalStorage, mockLocalStorage } from '@/../vitest.setup.ts'
import { api } from '@/app/api/_index'
import { anotherArticle, article } from '@/shared/test/constants'
import { RouteNames } from '@/app/routes'

let wrapper: VueWrapper<any> | null

const { useRouteMock, pushMock } = vitest.hoisted(() => {
  return {
    pushMock: vitest.fn(),
    useRouteMock: vitest.fn(() => ({ params: { slug: article.slug } })),
  }
})

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object

  return {
    ...actual,
    useRouter: vitest.fn(() => ({ push: pushMock })),
    useRoute: useRouteMock,
  }
})

function createWrapper() {
  return shallowMount(ArticleEditPage, {
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

const getByTestId = (testId: string) => wrapper!.get(`[data-test="${testId}"]`)

describe('articleEditPage Component', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    vitest.restoreAllMocks()
    clearLocalStorage()
  })

  describe('fetch article requests', () => {
    it('correctrly presets and updates form', async () => {
      const get = vitest.spyOn(api, 'get').mockResolvedValue({
        data: { article: JSON.parse(JSON.stringify(article)) },
        status: 200,
      })
      wrapper = createWrapper()

      expect(get).toHaveBeenCalledOnce()
      expect(get).toHaveBeenCalledWith(`/articles/${article.slug}`, authFetchOptions)
      await flushPromises()

      expect((getByTestId('article-title-input').element as HTMLInputElement).value).toBe(article.title)
      expect((getByTestId('article-description-input').element as HTMLInputElement).value).toBe(article.description)
      expect((getByTestId('article-body-textarea').element as HTMLTextAreaElement).value).toBe(article.body)
      expect(wrapper.getComponent(TagsInput).props('tags')).toEqual(article.tagList)
    })
    it('correctly handles error in response', async () => {
      const get = vitest.spyOn(api, 'get').mockRejectedValue({
        data: null,
        status: 500,
      })
      wrapper = createWrapper()

      expect(get).toHaveBeenCalledOnce()
      expect(get).toHaveBeenCalledWith(`/articles/${article.slug}`, authFetchOptions)
      await flushPromises()

      expect((getByTestId('article-title-input').element as HTMLInputElement).value).toBe('')
      expect((getByTestId('article-description-input').element as HTMLInputElement).value).toBe('')
      expect((getByTestId('article-body-textarea').element as HTMLTextAreaElement).value).toBe('')
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
      const put = vitest.spyOn(api, 'put').mockResolvedValue({
        data: { article: { ...JSON.parse(JSON.stringify(article)), valuesToUpdate } },
        status: 200,
      })
      wrapper = createWrapper()
      await flushPromises()

      getByTestId('article-title-input').setValue(valuesToUpdate.title)
      getByTestId('article-description-input').setValue(valuesToUpdate.description)
      getByTestId('article-body-textarea').setValue(valuesToUpdate.body)
      const { form } = wrapper.vm
      form.tagList = valuesToUpdate.tagList
      await flushPromises()

      getByTestId('publish-button').trigger('submit')
      await flushPromises()

      expect(put).toHaveBeenCalledOnce()
      expect(put).toHaveBeenCalledWith(`/articles/${article.slug}`, { article: valuesToUpdate }, authFetchOptions)
      expect(pushMock).toHaveBeenCalledOnce()
      expect(pushMock).toHaveBeenCalledWith({ name: RouteNames.ARTICLE, params: { slug: article.slug } })
    })

    it('correctly submits create article', async () => {
      const valuesToCreate = { title: anotherArticle.title, description: anotherArticle.description, body: anotherArticle.body, tagList: anotherArticle.tagList }

      useRouteMock.mockImplementationOnce(() => ({ params: { slug: '' } }))
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { article },
        status: 200,
      })
      const post = vitest.spyOn(api, 'post').mockResolvedValue({
        data: { article: { ...JSON.parse(JSON.stringify(article)), valuesToCreate } },
        status: 200,
      })
      wrapper = createWrapper()
      await flushPromises()

      getByTestId('article-title-input').setValue(valuesToCreate.title)
      getByTestId('article-description-input').setValue(valuesToCreate.description)
      getByTestId('article-body-textarea').setValue(valuesToCreate.body)
      wrapper.vm.form.tagList = valuesToCreate.tagList
      await flushPromises()

      getByTestId('publish-button')?.trigger('submit')
      await flushPromises()

      expect(post).toHaveBeenCalledOnce()
      expect(post).toHaveBeenCalledWith('/articles', { article: valuesToCreate }, authFetchOptions)
      expect(pushMock).toHaveBeenCalledOnce()
      expect(pushMock).toHaveBeenCalledWith({ name: RouteNames.ARTICLE, params: { slug: article.slug } })
    })

    it('renders errors correctly', async () => {
      const valuesToUpdate = { title: anotherArticle.title, description: anotherArticle.description, body: anotherArticle.body, tagList: anotherArticle.tagList }

      vitest.spyOn(console, 'error').mockImplementation(() => { })
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: null,
        status: 500,
      })
      const put = vitest.spyOn(api, 'put').mockResolvedValue({
        data: { article: { ...JSON.parse(JSON.stringify(article)), valuesToUpdate } },
        status: 200,
      })
      wrapper = createWrapper()
      await flushPromises()

      getByTestId('publish-button').trigger('submit')
      await flushPromises()

      expect(put).not.toHaveBeenCalled()
      expect(pushMock).not.toHaveBeenCalled()
      expect(wrapper.vm.formErrors.length).toBe(3)

      getByTestId('article-title-input').setValue(valuesToUpdate.title)
      await flushPromises()
      getByTestId('publish-button').trigger('submit')
      await flushPromises()

      expect(put).not.toHaveBeenCalled()
      expect(pushMock).not.toHaveBeenCalled()
      expect(wrapper.vm.formErrors.length).toBe(2)
    })
  })
})
