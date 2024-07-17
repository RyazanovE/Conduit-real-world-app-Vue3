import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vitest } from 'vitest'
import type { RouterLink } from 'vue-router'
import PopularTags from '../ui/PopularTags.vue'
import { article } from '@/features/article-preview/tests/constants'
import { api } from '@/app/api/_index'

let wrapper: VueWrapper<any> | null

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object
  return {
    ...actual,
    useRoute: vitest.fn(() => ({
      query: {
        source: 'some-source',
        page: 999,
      },
    })),
  }
})

function createWrapper(props = {} as any) {
  return shallowMount(PopularTags, {
    props,
    global: {
      stubs: {
        'router-link': {
          template: '<a data-test="img-profile-link" :href="to"><slot></slot></a>',
          props: ['to'],
        },
      },
    },
  })
}

describe('popularTags component', () => {
  afterEach(() => {
    wrapper = null
    vitest.restoreAllMocks()
  })

  describe('tags list', () => {
    it('correctly renders tags list with successfull response', async () => {
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { tags: article.tagList },
        status: 200,
      })
      wrapper = createWrapper()
      await flushPromises()

      const foundToProps = wrapper.findAllComponents<typeof RouterLink>('[data-test="popular-tag"]')?.map(el => el.props('to'))
      const foundTexts = wrapper.findAllComponents<typeof RouterLink>('[data-test="popular-tag"]')?.map(el => el.text())
      const expectedToProps = article.tagList.map(tag => ({ name: 'feed', query: { page: 1, source: undefined, tag } }))

      expect(foundToProps).toEqual(expectedToProps)
      expect(foundTexts).toEqual(article.tagList)
    })

    it('correctly handles error response', async () => {
      vitest.spyOn(api, 'get').mockRejectedValue({
        status: 500,
      })
      wrapper = createWrapper()
      await flushPromises()

      expect(wrapper.findAllComponents<typeof RouterLink>('[data-test="popular-tag"]').length).toBe(0)
    })
  })
})
