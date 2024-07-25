import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import { nextTick } from 'vue'
import UserInfo from '../ui/UserInfo.vue'
import { mockProfileData } from '@/shared/test/constants'
import { authFetchOptions, clearLocalStorage, mockLocalStorage, user } from '@/../vitest.setup'
import { api } from '@/app/api/_index'

let wrapper: VueWrapper<any> | null

vitest.spyOn(console, 'error').mockImplementation(() => { })

const { useRouteMock, pushMock } = vitest.hoisted(() => {
  return {
    useRouteMock: vitest.fn(),
    pushMock: vitest.fn(),
  }
})

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object

  return {
    ...actual,
    useRoute: useRouteMock,
    useRouter: vitest.fn(() => ({ push: pushMock })),
  }
})

function createWrapper(props = {} as any) {
  return shallowMount(UserInfo, { props })
}

function findByTestId(testId: string) {
  return wrapper!.find(`[data-test="${testId}"]`)
}

describe('userInfo Component', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    clearLocalStorage()
    vitest.clearAllMocks()
  })

  it('correctly fullfils props', async () => {
    useRouteMock.mockReturnValue({ params: {} })
    wrapper = createWrapper({ user: JSON.parse(JSON.stringify(mockProfileData)) })

    const userImage = findByTestId('user-image')
    const usernameHeader = findByTestId('username-header')
    const bioParagraph = findByTestId('bio-paragraph')
    expect(userImage.exists()).toBeTruthy()
    expect(userImage.attributes('src')).toBe(mockProfileData.image)
    expect(usernameHeader.exists()).toBeTruthy()
    expect(usernameHeader.text()).toBe(mockProfileData.username)
    expect(bioParagraph.exists()).toBeTruthy()
    expect(bioParagraph.text()).toBe(mockProfileData.bio)
  })
  it('correctly renders edit/follow buttons on random user page', async () => {
    useRouteMock.mockReturnValue({ params: { username: 'not-my-username' } })
    wrapper = createWrapper({ user: JSON.parse(JSON.stringify(mockProfileData)) })

    expect(findByTestId('follow-button').exists()).toBeTruthy()
    expect(findByTestId('edit-profile-button').exists()).toBeFalsy()
  })
  it('correctly renders edit/follow buttons on my-profile page', async () => {
    useRouteMock.mockReturnValue({ params: { username: user.username } })
    wrapper = createWrapper({ user: JSON.parse(JSON.stringify(mockProfileData)) })
    await nextTick()

    expect(findByTestId('follow-button').exists()).toBeFalsy()
    expect(findByTestId('edit-profile-button').exists()).toBeTruthy()
  })
  it('correctly renders followButtonName by changing props and emits event', async () => {
    useRouteMock.mockReturnValue({ params: { username: 'not-my-username' } })
    const post = vitest.spyOn(api, 'post').mockResolvedValue(() => ({
      status: 200,
    }))
    const deleteMethod = vitest.spyOn(api, 'delete').mockResolvedValue(() => ({
      status: 200,
    }))
    wrapper = createWrapper({ user: JSON.parse(JSON.stringify(mockProfileData)) })

    expect(findByTestId('follow-button').exists()).toBeTruthy()
    expect(findByTestId('follow-button').text()).toBe(`Follow ${mockProfileData.username}`)
    await findByTestId('follow-button').trigger('click')
    expect(post).toHaveBeenCalledOnce()
    expect(post).toHaveBeenCalledWith(`/profiles/${mockProfileData.username}/follow`, undefined, authFetchOptions)
    expect(deleteMethod).not.toHaveBeenCalled()
    expect(wrapper.emitted('followedAuthor')).toBeDefined()
    expect(wrapper.emitted('followedAuthor')![0]![0]).toBe(true)

    post.mockReset()

    await wrapper.setProps({ user: { ...JSON.parse(JSON.stringify(mockProfileData)), following: true } })
    expect(findByTestId('follow-button').exists()).toBeTruthy()
    expect(findByTestId('follow-button').text()).toBe(`Unfollow ${mockProfileData.username}`)
    await findByTestId('follow-button').trigger('click')
    expect(deleteMethod).toHaveBeenCalledOnce()
    expect(deleteMethod).toHaveBeenCalledWith(`/profiles/${mockProfileData.username}/follow`, authFetchOptions)
    expect(post).not.toHaveBeenCalled()
    expect(wrapper.emitted('followedAuthor')?.length).toBe(2)
    expect(wrapper.emitted('followedAuthor')![1]![0]).toBe(false)
  })
  it('correctly emits event with rejected response', async () => {
    useRouteMock.mockReturnValue({ params: { username: 'not-my-username' } })
    const post = vitest.spyOn(api, 'post').mockRejectedValue(() => ({
      status: 500,
    }))
    vitest.spyOn(api, 'delete').mockRejectedValueOnce(() => ({
      status: 500,
    }))
    wrapper = createWrapper({ user: JSON.parse(JSON.stringify(mockProfileData)) })
    await findByTestId('follow-button').trigger('click')
    expect(wrapper.emitted('followedAuthor')?.length).toBe(2)
    expect(wrapper.emitted('followedAuthor')![0]![0]).toBe(true)
    expect(wrapper.emitted('followedAuthor')![1]![0]).toBe(false)

    post.mockReset()

    await wrapper.setProps({ user: { ...JSON.parse(JSON.stringify(mockProfileData)), following: true } })
    await findByTestId('follow-button')!.trigger('click')
    expect(wrapper.emitted('followedAuthor')?.length).toBe(4)
    expect(wrapper.emitted('followedAuthor')![2]![0]).toBe(false)
    expect(wrapper.emitted('followedAuthor')![3]![0]).toBe(true)
  })
})
