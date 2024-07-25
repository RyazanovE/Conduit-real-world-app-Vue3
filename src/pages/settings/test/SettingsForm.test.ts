import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { nextTick } from 'vue'
import SettingsForm from '../ui/SettingsForm.vue'
import { clearLocalStorage, mockLocalStorage, user } from '@/../vitest.setup'

let wrapper: VueWrapper<any> | null

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object
  return {
    ...actual,
    useRoute: () => ({}),
  }
})

function createWrapper() {
  return shallowMount(SettingsForm)
}

describe('settingsForm component', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    clearLocalStorage()
    vi.restoreAllMocks()
  })

  function getElementById(testId: string) {
    return wrapper!.get(`[data-test="${testId}"]` as any)
  }

  it('successfully fulfills formValues and emits submit event', async () => {
    clearLocalStorage()
    wrapper = createWrapper()

    const inputsDict = [
      { id: 'image-url-input', value: 'some-image' },
      { id: 'username-input', value: 'some-username' },
      { id: 'bio-input', value: 'some-bio' },
      { id: 'email-input', value: 'some-email' },
      { id: 'password-input', value: 'some-password' },
    ]
    const inputs = inputsDict.map(({ id, value }) => ({
      el: getElementById(id),
      value,
    }))

    expect(inputs.every(({ el }) => el.element.value === '')).toBe(true)

    await Promise.all(inputs.map(({ el, value }) => el.setValue(value)))

    expect(inputs.map(({ el }) => el.element.value)).toEqual(inputs.map(({ value }) => value))

    const expectedEmitted = inputsDict.reduce((acc, { value }) => ({ ...acc, [value.split('-')![1]]: value }), [])
    await getElementById('submit-button').trigger('submit')
    expect(wrapper.emitted.length).toEqual(1)
    expect(wrapper.emitted('submit')![0][0]).toEqual(expectedEmitted)
  })
  it('successfully fulfills formValues with currentUser values', async () => {
    wrapper = createWrapper()
    await nextTick()

    const inputs = [
      { id: 'image-url-input', value: user.image },
      { id: 'username-input', value: user.username },
      { id: 'bio-input', value: user.bio },
      { id: 'email-input', value: user.email },
      { id: 'password-input', value: '' },
    ].map(({ id, value }) => ({
      el: getElementById(id),
      value,
    }))
    const receivedInputValues = inputs.map(({ el }) => el.element.value)
    const expectedInputValues = inputs.map(({ value }) => value)

    expect(receivedInputValues).toEqual(expectedInputValues)
  })
})
