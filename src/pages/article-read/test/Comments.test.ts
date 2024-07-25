import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import type { RouterLink } from 'vue-router'
import Comments from '../ui/Comments.vue'
import { comments } from './constants'
import { authFetchOptions, clearLocalStorage, mockLocalStorage, user } from '@/../vitest.setup.ts'
import { api } from '@/app/api/_index'
import { article } from '@/shared/test/constants'

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

describe('comments Component', () => {
  let wrapper: VueWrapper<any> | null

  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    clearLocalStorage()
    vitest.restoreAllMocks()
  })

  const getByTestId = (testId: string) => wrapper?.get(`[data-test="${testId}"]`)
  const findAllByTestId = (testId: string) => wrapper?.findAll(`[data-test="${testId}"]`)

  const mountWrapper = () => {
    wrapper = mount(Comments, {
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

  describe('comments interpolation and attributes', () => {
    it('correctly fetch and renders comments', async () => {
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { comments },
        status: 200,
      })
      mountWrapper()

      expect(api.get).toHaveBeenCalledOnce()
      expect(api.get).toHaveBeenCalledWith(`/articles/${article.slug}/comments`, authFetchOptions)

      await flushPromises()
      const commentsElements = findAllByTestId('comment')

      expect(commentsElements?.map(el => el.get('[data-test="comment-body"]').text())).toEqual(comments.map(comment => comment.body))
      expect(commentsElements?.map(el => el.get('[data-test="comment-author-image"]').attributes('src'))).toEqual(comments.map(comment => comment.author.image))
      expect(commentsElements?.map(el => el.get('[data-test="comment-author-username-link"]').text())).toEqual(comments.map(comment => comment.author.username))
      expect(commentsElements?.map(el => el.get('[data-test="comment-created-date"]').text())).toEqual(comments.map(comment => comment.createdAt))
      expect(commentsElements?.map(el => el.getComponent<typeof RouterLink>('[data-test="comment-author-username-link"]').props('to'))).toEqual(comments.map(comment => ({ name: 'profile', params: { username: comment.author.username } })))
      expect(commentsElements?.map(el => el.getComponent<typeof RouterLink>('[data-test="comment-author-image-link"]').props('to'))).toEqual(comments.map(comment => ({ name: 'profile', params: { username: comment.author.username } })))
    })

    it('correctly handles fetch error', async () => {
      vitest.spyOn(api, 'get').mockRejectedValue(null)
      mountWrapper()

      expect(api.get).toHaveBeenCalledOnce()
      expect(api.get).toHaveBeenCalledWith(`/articles/${article.slug}/comments`, authFetchOptions)

      await flushPromises()
      const commentsElements = findAllByTestId('comment')

      expect(commentsElements?.length).toBe(0)
    })
  })

  describe('currentUser conditions and interpolation', () => {
    it('correctly interpolate fullfiled currentUser', async () => {
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { comments: comments.map((comm, i) => i === 0 ? { ...comm, author: user } : comm) },
        status: 200,
      })

      mountWrapper()
      await flushPromises()

      expect(getByTestId('current-user-image')?.attributes('src')).toBe(user.image)
      expect(findAllByTestId('delete-comment')?.length).toBe(1)
      expect(findAllByTestId('empty-current-user-row')?.length).toBe(0)
    })
    it('correctly interpolate empty currentUser', async () => {
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { comments },
        status: 200,
      })
      localStorage.removeItem('user')

      mountWrapper()
      await flushPromises()

      expect(findAllByTestId('current-user-image')?.length).toBe(0)
      expect(findAllByTestId('delete-comment')?.length).toBe(0)
      expect(findAllByTestId('empty-current-user-row')?.length).toBe(1)
    })
  })

  describe('post comment', () => {
    it('correctly sends post comment request', async () => {
      const commentValue = 'some-value'
      vitest.spyOn(api, 'get').mockResolvedValue({
        data: { comments: comments.map((comm, i) => i === 0 ? { ...comm, author: user } : comm) },
        status: 200,
      })
      vitest.spyOn(api, 'post').mockResolvedValue({
        data: comments.slice(0, 1),
        status: 200,
      })

      mountWrapper()
      await flushPromises()

      await getByTestId('comment-textarea')?.setValue(commentValue)
      await getByTestId('post-comment-form')?.trigger('submit')

      expect(api.post).toHaveBeenCalledOnce()
      expect(api.post).toHaveBeenCalledWith(`/articles/${article.slug}/comments`, { comment: { body: commentValue } }, authFetchOptions)
    })
  })

  describe('delete comment', () => {
    it('correctly sends delete comment request', async () => {
      vitest.spyOn(api, 'get').mockResolvedValueOnce({
        data: { comments: comments.map(comm => ({ ...comm, author: user })) },
        status: 200,
      })
      vitest.spyOn(api, 'delete').mockResolvedValue({
        data: undefined,
        status: 200,
      })

      mountWrapper()
      await flushPromises()

      expect(findAllByTestId('comment')?.length).toBe(2)

      await findAllByTestId('delete-comment-form')?.[0].trigger('submit')

      expect(api.delete).toHaveBeenCalledOnce()
      expect(api.delete).toHaveBeenCalledWith(`/articles/${article.slug}/comments/${comments[0].id}`, authFetchOptions)
    })
  })
})
