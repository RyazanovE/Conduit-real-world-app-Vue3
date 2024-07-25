import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import ArticleReadPage from '../ui/ArticleReadPage.vue'
import { authFetchOptions, clearLocalStorage, mockLocalStorage } from '@/../vitest.setup.ts'
import { article } from '@/shared/test/constants'
import { api } from '@/app/api/_index'

let wrapper: VueWrapper<any> | null

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object

  return {
    ...actual,
    useRoute: vitest.fn(() => ({ params: { slug: article.slug } })),
  }
})

const getByTestId = (testId: string) => wrapper!.get(`[data-test="${testId}"]`)
const findAllByTestId = (testId: string) => wrapper!.findAll(`[data-test="${testId}"]`)

function createWrapper(props = {} as any) {
  return mount(ArticleReadPage, {
    props,
    shallow: true,
  })
}

describe('articleReadPage component', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    clearLocalStorage()
    vitest.restoreAllMocks()
  })

  describe('article info', () => {
    it('correctly interpolates article info', async () => {
      const get = vitest.spyOn(api, 'get').mockResolvedValue({
        data: { article },
        status: 200,
      })

      wrapper = createWrapper({ article: JSON.parse(JSON.stringify(article)) })

      expect(get).toHaveBeenCalledOnce()
      expect(get).toHaveBeenCalledWith(`/articles/${article.slug}`, authFetchOptions)
      await flushPromises()

      expect(getByTestId('article-title').text()).toBe(article.title)
      expect(getByTestId('article-body').text()).toBe(article.body)
      expect(findAllByTestId('article-tag').map(el => el.text())).toEqual(article.tagList)
    })
  })
})
