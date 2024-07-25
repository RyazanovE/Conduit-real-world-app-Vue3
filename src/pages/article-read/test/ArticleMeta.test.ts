import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import type { RouterLink } from 'vue-router'
import { nextTick } from 'vue'
import ArticleMeta from '../ui/ArticleMeta.vue'
import { clearLocalStorage, mockLocalStorage, user } from '@/../vitest.setup.ts'
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

describe('articleMeta component', () => {
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

  function createWrapper(props = {} as any) {
    return mount(ArticleMeta, {
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

  describe('profile info', () => {
    it('correctly fills profile info', async () => {
      wrapper = createWrapper({ article })
      await nextTick()

      const imageProfileLink = wrapper.getComponent<typeof RouterLink>('[data-test="image-profile-link"]')
      const usernameProfileLink = wrapper.getComponent<typeof RouterLink>('[data-test="username-profile-link"]')
      const profileLinkToPropValue = { name: 'profile', params: { username: article.author.username } }

      expect(imageProfileLink.props('to')).toEqual(profileLinkToPropValue)
      expect(imageProfileLink.get('img').attributes('src')).toBe(article.author.image)
      expect(usernameProfileLink.props('to')).toEqual(profileLinkToPropValue)
      expect(usernameProfileLink.text()).toBe(article.author.username)
      expect(getByTestId('article-date')?.text()).toBe(article.createdAt)
      expect((getByTestId('hidden-username-input')?.element as HTMLInputElement).value).toBe(article.author.username)
    })
  })

  describe('"Edit profile" button', () => {
    it('hides edit profile button with author = currentUser', async () => {
      wrapper = createWrapper({ article })
      await nextTick()

      expect(wrapper.find('[data-test="edit-article-block"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="follow-author-block"]').exists()).toBeTruthy()
      expect(getByTestId('author-follow-button')?.attributes('class')).toContain('btn-secondary')
    })
    it('shows edit profile button with author != currentUser', async () => {
      wrapper = createWrapper({ article: { ...article, author: user } })
      await nextTick()

      expect(wrapper.find('[data-test="edit-article-block"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="follow-author-block"]').exists()).toBeFalsy()
      expect(wrapper.getComponent<typeof RouterLink>('[data-test="edit-article-link"]').props('to')).toEqual({ name: 'editor', params: { slug: article.slug } })
    })
  })

  describe('"(Un)Follow author" button', () => {
    it('shows follow button with subscription and emits right event by click', async () => {
      wrapper = createWrapper({ article })
      await nextTick()

      expect(getByTestId('author-follow-button')?.attributes('class')).toContain('btn-secondary')
      expect(getByTestId('author-follow-button')?.attributes('class')).not.toContain('btn-outline-secondary')
      expect(getByTestId('author-follow-button')?.text()).not.toContain('Follow')
      expect(getByTestId('author-follow-button')?.text()).toContain('Unfollow')
      expect(getByTestId('author-follow-button')?.text()).toContain(article.author.username)
      expect(getByTestId('author-favorite-button')?.attributes('class')).toContain('btn-primary')
      expect(getByTestId('author-favorite-button')?.attributes('class')).not.toContain('btn-outline-primary')
      expect(getByTestId('author-favorite-button')?.text()).not.toContain('Favorite')
      expect(getByTestId('author-favorite-button')?.text()).toContain('Unfavorite')
      expect(getByTestId('article-favorites-count')?.text()).toBe(`(${article.favoritesCount})`)

      await getByTestId('author-follow-button')?.trigger('click')
      expect(wrapper.emitted('followedAuthor')![0]![0]).toBe(false)
    })
    it('shows unfollow button without subscription and emits right event by click', async () => {
      wrapper = createWrapper({ article: { ...article, favorited: false, author: { ...article.author, following: false } } })
      await nextTick()

      expect(getByTestId('author-follow-button')?.attributes('class')).not.toContain('btn-secondary')
      expect(getByTestId('author-follow-button')?.attributes('class')).toContain('btn-outline-secondary')
      expect(getByTestId('author-follow-button')?.text()).toContain('Follow')
      expect(getByTestId('author-follow-button')?.text()).not.toContain('Unfollow')
      expect(getByTestId('author-favorite-button')?.attributes('class')).not.toContain('btn-primary')
      expect(getByTestId('author-favorite-button')?.attributes('class')).toContain('btn-outline-primary')
      expect(getByTestId('author-favorite-button')?.text()).toContain('Favorite')
      expect(getByTestId('author-favorite-button')?.text()).not.toContain('Unfavorite')
      expect(getByTestId('article-favorites-count')?.text()).toBe(`(${article.favoritesCount})`)

      await getByTestId('author-follow-button')?.trigger('click')
      expect(wrapper.emitted('followedAuthor')![0]![0]).toBe(true)
    })
  })

  describe('"Favorite post" button', () => {
    it('shows favorite post button with article favorited and emits right event by click', async () => {
      wrapper = createWrapper({ article })
      await nextTick()

      expect(getByTestId('author-follow-button')?.attributes('class')).toContain('btn-secondary')
      expect(getByTestId('author-follow-button')?.attributes('class')).not.toContain('btn-outline-secondary')
      expect(getByTestId('author-follow-button')?.text()).not.toContain('Follow')
      expect(getByTestId('author-follow-button')?.text()).toContain('Unfollow')
      expect(getByTestId('author-follow-button')?.text()).toContain(article.author.username)
      expect(getByTestId('author-favorite-button')?.attributes('class')).toContain('btn-primary')
      expect(getByTestId('author-favorite-button')?.attributes('class')).not.toContain('btn-outline-primary')
      expect(getByTestId('author-favorite-button')?.text()).not.toContain('Favorite')
      expect(getByTestId('author-favorite-button')?.text()).toContain('Unfavorite')
      expect(getByTestId('article-favorites-count')?.text()).toBe(`(${article.favoritesCount})`)

      await getByTestId('author-favorite-button')?.trigger('click')
      expect(wrapper.emitted('favoritedArticle')![0]![0]).toBe(false)
    })
    it('shows unfavorite post button without article favorited and emits right event by click', async () => {
      wrapper = createWrapper({ article: { ...article, favorited: false, author: { ...article.author, following: false } } })
      await nextTick()

      expect(getByTestId('author-follow-button')?.attributes('class')).not.toContain('btn-secondary')
      expect(getByTestId('author-follow-button')?.attributes('class')).toContain('btn-outline-secondary')
      expect(getByTestId('author-follow-button')?.text()).toContain('Follow')
      expect(getByTestId('author-follow-button')?.text()).not.toContain('Unfollow')
      expect(getByTestId('author-favorite-button')?.attributes('class')).not.toContain('btn-primary')
      expect(getByTestId('author-favorite-button')?.attributes('class')).toContain('btn-outline-primary')
      expect(getByTestId('author-favorite-button')?.text()).toContain('Favorite')
      expect(getByTestId('author-favorite-button')?.text()).not.toContain('Unfavorite')
      expect(getByTestId('article-favorites-count')?.text()).toBe(`(${article.favoritesCount})`)

      await getByTestId('author-favorite-button')?.trigger('click')
      expect(wrapper.emitted('favoritedArticle')![0]![0]).toBe(true)
    })
  })
})
