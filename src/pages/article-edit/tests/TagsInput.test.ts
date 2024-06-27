import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TagsInput from '../ui/TagsInput.vue'

describe('tagsInput Component', () => {
  const tags = ['tag1', 'tag2', 'tag3']
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(TagsInput, { props: { tags } })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  const getByTestId = (testId: string) => wrapper.get(`[data-test="${testId}"]`)
  const findAllByTestId = (testId: string) => wrapper.findAll(`[data-test="${testId}"]`)

  describe('attributes and interpolation', () => {
    it('correctly sets tagsInputValue', async () => {
      expect((getByTestId('tags-input').element as HTMLInputElement).value).toBe(tags.join(','))

      wrapper.setProps({ tags: undefined })
      await flushPromises()

      expect((getByTestId('tags-input').element as HTMLInputElement).value).toBe('')
    })

    it('correctly renders filteredTags', async () => {
      expect(findAllByTestId('tag-list-item').map(item => item.text())).toEqual(tags)

      wrapper.setProps({ tags: undefined })
      await flushPromises()

      expect(findAllByTestId('tag-list-item').map(item => item.text()).length).toBe(0)
    })
  })

  describe('tag remove', () => {
    it('correctly emits remove event by mouse click', () => {
      findAllByTestId('tag-list-item')[0]?.get('i').trigger('click')

      expect(wrapper.emitted('update:tags')).toBeTruthy()
      expect(wrapper.emitted('update:tags')![0]).toEqual([tags.slice(1)])
    })
    it('correctly emits remove event by keyboard buttons click', async () => {
      await findAllByTestId('tag-list-item')[0]?.get('i').trigger('keydown.space')
      await findAllByTestId('tag-list-item')[0]?.get('i').trigger('keydown.enter')

      expect(wrapper.emitted('update:tags')).toEqual([[tags.slice(1)], [tags.slice(1)]])
    })
  })

  describe('input change', () => {
    it('correctly emits input change', async () => {
      const inputTags = 'tag1, tag2'

      await getByTestId('tags-input').setValue(inputTags)

      expect(wrapper.emitted('update:tags')).toEqual([[inputTags.split(',')]])
    })
  })
})
