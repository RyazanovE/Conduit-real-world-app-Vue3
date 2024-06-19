<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    tags?: string[];
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['update:tags']);

  const tagsInputValue = computed(() => props.tags?.join(',') ?? '');

  const handleInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    emits('update:tags', input.value.split(','))
  };

  const removeTag = (tag: string) => {
    emits('update:tags', props.tags?.filter(t => t !== tag))
  };
</script>

<template>
  <input
    type="text"
    class="form-control"
    placeholder="Enter tags"
    :value="tagsInputValue"
    @input="handleInputChange"
  />
  <div class="tag-list">
    <span
      v-for="tag in props.tags"
      :key="tag"
      class="tag-default tag-pill"
    >
      <i
        class="ion-close-round"
        role="button"
        tabindex="0"
        @keydown.space.prevent="removeTag(tag)"
        @keydown.enter.prevent="removeTag(tag)"
        @click="removeTag(tag)"
      ></i>
      {{ tag }}
    </span>
  </div>
</template>