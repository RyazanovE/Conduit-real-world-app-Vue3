<script setup lang="ts">
import { computed } from 'vue'

interface TagsInputProps {
  tags?: string[]
}

const props = defineProps<TagsInputProps>()
const emits = defineEmits(['update:tags'])

const tagsInputValue = computed(() => props.tags?.join(',') ?? '')

const filteredTags = computed(() => props.tags?.filter(Boolean) ?? [])

function handleInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  emits('update:tags', input.value.split(','))
}

function removeTag(tag: string) {
  emits('update:tags', props.tags?.filter(t => t !== tag))
}
</script>

<template>
  <input
    data-test="tags-input"
    type="text"
    class="form-control"
    placeholder="Enter tags"
    :value="tagsInputValue"
    @input="handleInputChange"
  >
  <div class="tag-list">
    <span
      v-for="tag in filteredTags"
      :key="tag"
      data-test="tag-list-item"
      class="tag-default tag-pill"
    >
      <i
        class="ion-close-round"
        role="button"
        tabindex="0"
        @keydown.space.prevent="removeTag(tag)"
        @keydown.enter.prevent="removeTag(tag)"
        @click="removeTag(tag)"
      />
      {{ tag }}
    </span>
  </div>
</template>
